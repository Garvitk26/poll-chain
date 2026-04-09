'use client';

import { useState } from 'react';
import PollCard from '@/components/shared/PollCard';
import { Search } from 'lucide-react';

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
            className="w-full bg-[#001224] border border-cyan-500/20 rounded-md py-2 pl-9 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(poll => (
          <PollCard key={poll.id} poll={poll} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-[#000d1a] border border-cyan-500/10 rounded-xl">
             No polls found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
