import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] py-20 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100">
            About <span className="gradient-text">PollChain</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We built PollChain to solve the fundamental flaw of modern digital voting: trust. By leveraging the Stellar consensus protocol, we eliminate the need for trust entirely.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-200">Our Mission</h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Democracy and organizational consensus rely on the integrity of the ballot box. But in the digital age, black-box servers and proprietary databases make verification impossible. Our mission is to make every vote cryptographically verifiable, permanently immutable, and universally accessible.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-200">The Technology</h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              We utilize the Stellar Network, renowned for its low fees ($0.00001 per tx) and high speed (5s finality). Every option in a PollChain poll maps to a specific Stellar Memo string. When a voter casts their ballot, they are signing a real transaction on the ledger.
            </p>
          </div>
        </div>

        <div className="bg-[#000d1a] border border-rose-500/15 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-100 mb-6">Meet the Team</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            We are a decentralized group of researchers, cryptography enthusiasts, and developers committed to open-source consensus.
          </p>
          <Link href="/about/team" className="btn-secondary inline-flex items-center gap-2">
            View Team Profiles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
