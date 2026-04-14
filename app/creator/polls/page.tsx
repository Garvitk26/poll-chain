'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function CreatorPollsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'closed'>('all');

  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/polls')
      .then(res => res.json())
      .then(data => {
        setPolls(data.polls || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPolls = filter === 'all' 
    ? polls 
    : polls.filter(p => p.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">My Polls</h1>
        <Link href="/creator/polls/new" className="btn-primary">
          Create New Poll
        </Link>
      </div>

      <div className="flex gap-2 border-b border-rose-500/10 pb-4">
        {['all', 'active', 'draft', 'closed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-[#000d1a] border border-rose-500/20 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#001224] border-b border-rose-500/10 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Options</th>
              <th className="px-6 py-4 font-medium">Votes</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-500/10 text-slate-300">
            {filteredPolls.map((poll) => (
              <tr key={poll._id} className="hover:bg-rose-500/5 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-200">{poll.title}</td>
                <td className="px-6 py-4">
                  <span className={`badge ${
                    poll.status === 'active' ? 'badge-rose animate-pulse' : 
                    poll.status === 'closed' ? 'badge-violet' : 
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">{poll.optionsCount}</td>
                <td className="px-6 py-4 font-mono text-rose-400">{poll.totalVotes}</td>
                <td className="px-6 py-4 flex gap-3 text-xs text-rose-400 font-bold uppercase tracking-widest">
                  {(poll.status === 'active' || poll.status === 'closed') && (
                    <Link href={`/results/${poll._id}`} className="hover:text-rose-300 transition-colors">
                      View Results
                    </Link>
                  )}
                  {poll.status === 'draft' && (
                    <Link href={`/creator/polls/${poll._id}`} className="hover:text-violet-300 transition-colors text-violet-400">
                      Manage
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {filteredPolls.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No polls found matching this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
