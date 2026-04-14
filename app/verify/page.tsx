'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

export default function VerifySearchPage() {
  const [txHash, setTxHash] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (txHash.trim()) {
      router.push(`/verify/${txHash.trim()}`);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] py-16 px-4 md:px-8 bg-[#00080f] flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-400 shadow-2xl shadow-rose-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight">On-Chain Verification</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Paste your transaction hash below to verify the immutable proof of your vote directly on the Stellar ledger.
          </p>
        </div>

        <div className="bg-[#000d1a] border border-rose-500/15 p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-12 h-12 text-rose-500" />
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="txHash" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                Transaction Hash (XDR)
              </label>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  id="txHash"
                  type="text"
                  placeholder="e.g. 52ca5f7607ce4e9f..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full bg-[#001224] border border-rose-500/20 rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:border-rose-500/50 outline-none transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={!txHash.trim()}
              className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2 group shadow-lg shadow-rose-600/20 disabled:opacity-50 disabled:grayscale transition-all"
            >
              Verify Proven Ballot
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-600 italic">
            *Verification works for any vote cast via the PollChain protocol on the Stellar Testnet.
          </p>
        </div>
      </div>
    </main>
  );
}
