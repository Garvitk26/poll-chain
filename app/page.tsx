'use client';

import Link from 'next/link';
import { ArrowRight, BarChart2, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function LandingPage() {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation(0.2);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section 
        className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 relative"
      >
        <div ref={heroRef as any} className={`max-w-4xl mx-auto transition-all duration-1000 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8 animate-bob1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_var(--cyan)] animate-pulse" />
            Live on Stellar Testnet
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-100 tracking-tight leading-tight mb-6">
            Voting that <span className="gradient-text">cannot</span> be changed.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            PollChain ensures absolute transparency by recording every vote as an immutable micropayment on the Stellar blockchain. No central servers, no silent modifications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary w-full sm:w-auto text-lg py-3 px-8 group flex items-center justify-center gap-2">
              Start Creating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/poll/explore" className="btn-secondary w-full sm:w-auto text-lg py-3 px-8 bg-[#001224]/50">
              Explore Active Polls
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 bg-[#000d1a] border-t border-cyan-500/10 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4">How it works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A cryptographic breakthrough in organizational consensus.
            </p>
          </div>

          <div 
            ref={featuresRef as any} 
            className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-1000 delay-200 transform ${featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            {/* Feature 1 */}
            <div className="bg-[#001224] p-8 rounded-2xl border border-cyan-500/15 hover:border-cyan-500/40 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Cryptographic Proof</h3>
              <p className="text-slate-400 leading-relaxed">
                Votes are not pushed to a proprietary database. Instead, users sign a zero-fee transaction bridging directly to the Stellar Horizon nodes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#001224] p-8 rounded-2xl border border-indigo-500/15 hover:border-indigo-500/40 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Public Verifiability</h3>
              <p className="text-slate-400 leading-relaxed">
                By encoding choices utilizing the Stellar Memo format, anybody can view, verify, and validate the poll output independently.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#001224] p-8 rounded-2xl border border-violet-500/15 hover:border-violet-500/40 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">Millisecond Finality</h3>
              <p className="text-slate-400 leading-relaxed">
                Results aggregate within 5 seconds. Connect your Freighter wallet, vote with instantly settled transaction speeds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
