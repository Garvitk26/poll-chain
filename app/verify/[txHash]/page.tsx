'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function VerifyPage({ params }: { params: { txHash: string } }) {
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState<any>(null);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await fetch(`/api/verify/${params.txHash}`);
        if (res.ok) {
          const data = await res.json();
          setTx(data.tx);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, [params.txHash]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-[spin_1s_linear_infinite]" />
        <p className="mt-4 text-rose-400 font-mono animate-pulse">Querying Stellar Horizon nodes...</p>
      </main>
    );
  }

  if (!tx) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-200">Transaction Not Found</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] py-16 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 mb-4 animate-bob1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Cryptographic Verification</h1>
          <p className="text-slate-400">Direct query from the Stellar Ledger</p>
        </div>

        <div className="bg-[#001224] border border-rose-500/20 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.05)] relative">
          
          {/* Scan Line effect */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-rose-500/50 shadow-[0_0_10px_var(--rose)] animate-scanLine opacity-50 z-0 pointer-events-none" />

          <div className="p-6 md:p-8 relative z-10 space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-rose-500/10">
              <span className="text-sm text-slate-400">Status</span>
              <span className="badge badge-rose px-3 py-1 font-semibold flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full border border-rose-200 bg-rose-500" />
                {tx.status.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-col gap-1 pb-4 border-b border-rose-500/10">
              <span className="text-sm text-slate-400">Transaction Hash</span>
              <span className="font-mono text-violet-300 break-all text-sm bg-[#000d1a] p-3 rounded-md border border-violet-500/10 select-all">
                {tx.hash}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-rose-500/10">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-slate-400">Ledger Index</span>
                <span className="font-mono font-medium text-slate-200">{tx.ledger}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-slate-400">Timestamp</span>
                <span className="font-medium text-slate-200 text-sm">
                  {new Date(tx.createdAt).toLocaleString()} <span className="text-xs text-slate-500 ml-1">({formatDistanceToNow(new Date(tx.createdAt))} ago)</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 pb-4 border-b border-rose-500/10">
              <span className="text-sm text-slate-400">Ledger Memo <span className="text-xs text-slate-500">(Vote Choice)</span></span>
              <span className="font-mono text-rose-400 text-lg font-bold bg-[#000d1a] p-3 rounded-md border border-rose-500/20 inline-flex items-center gap-2 w-fit">
                {tx.memo}
              </span>
            </div>

            <div className="pt-2 text-center">
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
              >
                View directly on Stellar.expert <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/poll/explore" className="text-slate-400 hover:text-rose-400 text-sm transition-colors inline-flex items-center gap-2">
            Explore other public polls <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
