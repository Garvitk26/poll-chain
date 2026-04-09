import Link from 'next/link';
import { Globe, Code, Briefcase, CheckSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000d1a] border-t border-cyan-500/10 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1 */}
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-bold gradient-text inline-block mb-4">
              PollChain
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Every vote permanently recorded on Stellar. Tamper-proof, transparent, and built for modern communities.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                <Code className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 hover:bg-violet-500/20 transition-colors">
                <Briefcase className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm tracking-wide">Product</h4>
            <ul className="space-y-3 flex flex-col text-sm text-slate-400">
              <li><Link href="/poll/explore" className="hover:text-cyan-400 transition-colors">Explore Polls</Link></li>
              <li><Link href="/creator/polls/new" className="hover:text-cyan-400 transition-colors">Create Poll</Link></li>
              <li><Link href="/verify" className="hover:text-cyan-400 transition-colors">Verify Vote</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm tracking-wide">Company</h4>
            <ul className="space-y-3 flex flex-col text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link></li>
              <li><Link href="/about/team" className="hover:text-cyan-400 transition-colors">Team</Link></li>
              <li><Link href="/blog" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-sm tracking-wide">Legal</h4>
            <ul className="space-y-3 flex flex-col text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="w-full h-px bg-cyan-500/10 mb-8" />
        
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PollChain. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            <CheckSquare className="w-3 h-3 text-cyan-500" />
            All votes recorded on Stellar blockchain. Permanently.
          </p>
        </div>
      </div>
    </footer>
  );
}
