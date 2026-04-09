import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] py-20 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400">Pay only for what you record on the ledger.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-[#000d1a] border border-cyan-500/20 rounded-2xl p-8 relative">
            <h2 className="text-2xl font-bold text-slate-200 mb-2">Voter</h2>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-100">$0</span>
              <span className="text-slate-400 pb-1">/ forever</span>
            </div>
            <p className="text-slate-400 text-sm mb-8 h-10">You pay only the Stellar network fee (approx $0.00001 per vote) via your own Freighter wallet.</p>
            
            <ul className="space-y-4 mb-8">
              {[
                'Vote on any public poll',
                'Verify transactions on Stellar',
                'Full historical tracking',
                'Zero platform fees'
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn-secondary w-full block text-center mt-auto">Start Voting</Link>
          </div>

          {/* Creator Tier */}
          <div className="bg-[#001224] border-2 border-indigo-500/40 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(99,102,241,0.15)] transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">RECOMMENDED</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-2">Creator Pro</h2>
            <div className="flex items-end gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-100">$29</span>
              <span className="text-slate-400 pb-1">/ month</span>
            </div>
            <p className="text-slate-400 text-sm mb-8 h-10">Everything you need to spawn immutable collectors and analyze organizational consensus.</p>
            
            <ul className="space-y-4 mb-8">
              {[
                'Unlimited Poll Creation',
                'Dedicated Stellar Collector Wallets',
                'Export raw CSV/JSON results',
                'Password-protected polls',
                'Advanced Demographic Analytics (Coming Soon)'
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="btn-primary w-full block text-center mt-auto shadow-[0_0_15px_rgba(99,102,241,0.3)]">Become a Creator</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
