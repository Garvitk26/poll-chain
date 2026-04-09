import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const posts = [
    { id: 1, title: 'Why Stellar is the Perfect Ledger for Micro-Voting', date: 'October 12, 2024', category: 'Engineering' },
    { id: 2, title: 'Re-inventing organizational consensus', date: 'September 28, 2024', category: 'Product' },
    { id: 3, title: 'PollChain Beta is Now Live', date: 'September 15, 2024', category: 'Announcements' },
  ];

  return (
    <main className="min-h-[calc(100vh-64px)] py-20 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4 border-b border-cyan-500/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Engineering Blog</h1>
          <p className="text-xl text-slate-400">Thoughts on cryptography, decentralization, and building PollChain.</p>
        </div>

        <div className="space-y-6">
          {posts.map(post => (
             <div key={post.id} className="bg-[#000d1a] border border-cyan-500/10 rounded-xl p-6 md:p-8 hover:border-cyan-500/30 transition-colors group cursor-pointer">
               <div className="flex items-center gap-3 mb-4">
                 <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">{post.category}</span>
                 <span className="text-xs text-slate-500">{post.date}</span>
               </div>
               <h2 className="text-2xl font-bold text-slate-200 mb-4 group-hover:text-cyan-300 transition-colors">{post.title}</h2>
               <div className="flex items-center text-indigo-400 text-sm font-medium gap-2">
                 Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </div>
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
