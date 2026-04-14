'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { isConnected } from '@stellar/freighter-api';
import { Info, AlertCircle, ArrowRight } from 'lucide-react';
import { triggerConfetti } from '@/components/shared/Confetti';
import { useToast } from '@/lib/context/ToastContext';
import TransactionSuccessCard from '@/components/shared/TransactionSuccessCard';
import { getAccountBalance } from '@/lib/stellar';
import { getAddress } from '@stellar/freighter-api';

export default function PublicPollPage({ params }: { params: { pollId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [lastTxHash, setLastTxHash] = useState("");
  const [updatedBalance, setUpdatedBalance] = useState("0.00");
  const [walletAddr, setWalletAddr] = useState("");
  
  const [poll, setPoll] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/polls/${params.pollId}`)
      .then(res => res.json())
      .then(data => {
        if (data.poll) {
          setPoll(data.poll);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.pollId]);

  const handleVote = async () => {
    if (!selectedOption) return;
    
    // Validations
    if (poll.requireWallet) {
       const connected = await isConnected();
       if (!connected) {
         showToast('Please connect your Freighter wallet via navbar first', 'warning');
         return;
       }
    }

    const { sendXLM, getXLMBalance } = await import('@/lib/stellar');
    const { address } = await getAddress();
    if (!address) {
      showToast('No wallet address found', 'error');
      return;
    }

    const option = poll.options.find((o: any) => o.id === selectedOption);
    if (!option) return;

    setVoting(true);
    
    try {
      // 1. Send the XLM transaction (Real vote)
      const result = await sendXLM({
        sourcePublicKey: address,
        destinationAddress: poll.collectorWallet,
        amountXLM: poll.voteAmount?.toString() || "0.00001",
        memo: option.memo
      });

      if (!result.success) {
        throw new Error(result.error || 'Transaction failed');
      }

      // 2. Record vote in DB via API (Real verification)
      const res = await fetch(`/api/polls/${poll._id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: result.txHash })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Vote recording failed');
      }
      
      const { vote } = await res.json();
      setLastTxHash(result.txHash);
      
      // Fetch fresh balance
      try {
        const bal = await getXLMBalance(address);
        setUpdatedBalance(bal.toFixed(7));
        setWalletAddr(address);
      } catch (e) {}

      setShowSuccessCard(true);
      triggerConfetti();
      showToast('Transaction confirmed! Your vote is securely recorded.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Transaction failed. Try again.', 'error');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="spin-ring opacity-50 w-10 h-10 border-t-rose-500" />
      </main>
    );
  }

  if (!poll || poll.status !== 'active') {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#000d1a] border border-rose-500/20 p-8 rounded-xl max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">Poll Unavailable</h2>
          <p className="text-slate-400 mb-6">This poll is either closed, archived, or does not exist.</p>
          <button onClick={() => router.push('/poll/explore')} className="btn-secondary w-full">
            Browse Active Polls
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Block */}
        <div className="bg-[#001224] border border-rose-500/20 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="badge badge-rose animate-pulse">Live Public Poll</span>
            <span className="text-xs text-slate-500 font-mono">ID: {poll?._id?.toString()?.substring(0,8) || 'Unknown'}</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text leading-tight mb-4">{poll.title}</h1>
          {poll.description && (
            <p className="text-slate-300 text-lg leading-relaxed">{poll.description}</p>
          )}
          
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-rose-500/10 text-xs text-slate-500">
            <Info className="w-4 h-4 text-rose-500" />
            <span>Voting sends a minuscule transaction to the collector wallet encoding your choice in the Memo field.</span>
          </div>
        </div>

        {/* Option Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-200 ml-2">Select an Option</h3>
          {poll.options.map((option: any) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 flex items-center justify-between group ${
                selectedOption === option.id
                  ? 'bg-rose-500/10 border-rose-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                  : 'bg-[#000d1a] border-rose-500/10 hover:border-rose-500/30'
              }`}
            >
              <div className="flex flex-col">
                <span className={`text-lg font-medium transition-colors ${selectedOption === option.id ? 'text-rose-400' : 'text-slate-200 group-hover:text-rose-200'}`}>
                  {option.label}
                </span>
                <span className="text-xs font-mono text-slate-500 mt-1 uppercase">Memo: {option.memo}</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                selectedOption === option.id ? 'border-rose-500' : 'border-slate-600'
              }`}>
                {selectedOption === option.id && <div className="w-3 h-3 bg-rose-500 rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        {/* Action Panel */}
        <div className="bg-[#000d1a] border border-rose-500/20 rounded-2xl p-6 sticky bottom-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 z-40">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">
              {selectedOption ? 'Ready to cast your vote on-chain.' : 'Select an option above to continue.'}
            </p>
            {poll.requireWallet && (
               <p className="text-xs text-violet-400">* Requires active Freighter connection</p>
            )}
          </div>
          <div className="w-full md:w-auto">
            <button
              onClick={handleVote}
              disabled={!selectedOption || voting}
              className={`btn-primary w-full md:w-auto py-3 px-8 text-base shadow-[0_0_15px_rgba(6,182,212,0.2)] ${(!selectedOption || voting) ? 'opacity-50 cursor-not-allowed filter grayscale' : ''}`}
            >
              {voting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit Vote <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </div>
        {showSuccessCard && (
          <TransactionSuccessCard 
            title="Vote Cast!"
            subtitle="Your choice has been permanently recorded on the Stellar ledger."
            txHash={lastTxHash}
            amount="0.0000100"
            walletAddress={walletAddr}
            walletBalance={updatedBalance}
            extraDetails={[
              { label: "Poll", value: poll.title },
              { label: "Option", value: poll.options.find((o: any) => o.id === selectedOption)?.label || "" },
              { label: "Network", value: "Stellar Testnet" }
            ]}
            onClose={() => {
              setShowSuccessCard(false);
              router.push(`/results/${poll.id}`);
            }}
          />
        )}

      </div>
    </main>
  );
}
