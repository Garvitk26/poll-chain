'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home, ShieldAlert } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#00080f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px] animate-pulse delay-700" />
      
      <div className="max-w-md w-full bg-[#000d1a] border border-rose-500/20 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative z-10 text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
          <div className="relative bg-[#000d1a] border border-rose-500/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
            Consensus <span className="text-rose-500">Error</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            The Protocol encountered a cryptographic anomaly. Every operation is recorded, but this specific request failed to reach consensus.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-left overflow-hidden">
              <p className="text-[10px] font-mono text-rose-400/70 uppercase tracking-widest mb-1">Debug Output</p>
              <p className="text-[10px] font-mono text-slate-500 break-all leading-relaxed lowercase">
                 {error.message || 'Unknown protocol interruption'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 shadow-[0_0_20px_rgba(244,63,94,0.15)] group"
          >
            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Re-Synchronize Protocol
          </button>
          
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-2"
          >
            <Home className="w-3 h-3" />
            Abort & Return Home
          </Link>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Security Subsystem Active</span>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
    </main>
  );
}
