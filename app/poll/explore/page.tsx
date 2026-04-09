'use client';

import { useState, useEffect } from 'react';
import PollCard from '@/components/shared/PollCard';
import { Search } from 'lucide-react';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';

export default function ExplorePolls() {
  const [search, setSearch] = useState('');
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/polls/explore')
      .then(res => res.json())
      .then(data => {
        setPolls(data.polls || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = polls.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="min-h-[calc(100vh-64px)] py-12 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Explore Pools</h1>
            <p className="text-slate-400">Discover active consensus networks.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#001224] border border-cyan-500/20 rounded-md py-2 pl-9 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
            />
          </div>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
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
        )}
      </div>
    </main>
  );
}
