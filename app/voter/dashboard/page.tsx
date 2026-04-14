'use client';

import { useState } from 'react';
import PollCard from '@/components/shared/PollCard';
import { Search, Activity } from 'lucide-react';
import WalletManager from '@/components/shared/WalletManager';
import SendXLMPanel from '@/components/shared/SendXLMPanel';

export default function VoterDashboard() {
  const [search, setSearch] = useState('');

  // Stub data
  const explorePolls = [
    { id: '1', title: 'Network Protocol Upgrade v2.0', description: 'Should we decrease the base reserve requirement from 0.5 XLM to 0.1 XLM to encourage wider testnet adoption?', status: 'active', optionsCount: 2, totalVotes: 512 },
    { id: '2', title: 'Community Funding Distribution', description: 'Which project category should receive the bulk of the treasury allocation this quarter?', status: 'active', optionsCount: 4, totalVotes: 1204 },
    { id: '3', title: 'DeFi Liquidity Pools', description: 'Should we incentivize AMM pairs with a temporary fee reduction?', status: 'closed', optionsCount: 2, totalVotes: 304 },
  ];

  const filtered = explorePolls.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Discover Polls</h1>
          <p className="text-slate-400">Find active consensus networks and cast your immutable vote.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by title or topic..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#001224] border border-rose-500/20 rounded-md py-2 pl-9 pr-4 text-sm text-slate-200 outline-none focus:border-rose-500/50 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Stellar Wallet Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WalletManager />
        </div>
        <div className="lg:col-span-1">
          <SendXLMPanel compact />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-5 h-full relative overflow-hidden group">
             <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
                <Activity size={32} className="animate-pulse" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Voter Verification</h3>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">Identity Linked to Ledger<br/>Consensus Power Active</p>
             </div>
             <div className="w-full h-px bg-white/5" />
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Status: Operational</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(poll => (
          <PollCard key={poll.id} poll={poll} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-[#000d1a] border border-rose-500/10 rounded-xl">
             No polls found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
