import { Code, Globe } from 'lucide-react';

export default function TeamPage() {
  const team = [
    { name: 'Alice Chen', role: 'Protocol Engineer', bio: 'Former core dev at Stellar Development Foundation.' },
    { name: 'Marcus D.', role: 'Cryptography Lead', bio: 'Specializes in zero-knowledge proofs and ledger consensus.' },
    { name: 'Sarah Jenkins', role: 'Product Design', bio: 'Obsessed with making Web3 interactions feel invisible.' }
  ];

  return (
    <main className="min-h-[calc(100vh-64px)] py-20 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-100">Our Team</h1>
          <p className="text-lg text-slate-400">The minds behind the immutable consensus layer.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, i) => (
             <div key={i} className="bg-[#000d1a] border border-cyan-500/10 rounded-xl p-6 hover:border-cyan-500/30 transition-colors text-center">
               <div className="w-20 h-20 mx-auto rounded-full bg-cyan-900/40 border-2 border-cyan-500/20 mb-4 flex items-center justify-center text-2xl font-bold text-cyan-400">
                 {member.name.charAt(0)}
               </div>
               <h3 className="text-xl font-bold text-slate-200 mb-1">{member.name}</h3>
               <p className="text-indigo-400 text-sm mb-4">{member.role}</p>
               <p className="text-slate-400 text-sm mb-6 line-clamp-3">{member.bio}</p>
               
               <div className="flex items-center justify-center gap-3">
                 <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors"><Globe className="w-4 h-4" /></a>
                 <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors"><Code className="w-4 h-4" /></a>
               </div>
             </div>
          ))}
        </div>
      </div>
    </main>
  );
}
