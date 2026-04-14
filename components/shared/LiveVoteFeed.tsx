'use client';

import { useLiveResults } from '@/hooks/useLiveResults';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';

interface LiveVoteFeedProps {
  pollId: string;
  collectorWallet: string;
}

export default function LiveVoteFeed({ pollId, collectorWallet }: LiveVoteFeedProps) {
  const { votes, loading } = useLiveResults(pollId, true);

  if (loading && votes.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center border border-dashed border-rose-500/30 rounded-xl bg-rose-900/5">
        <div className="spin-ring opacity-50" />
      </div>
    );
  }

  if (votes.length === 0) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center border border-dashed border-rose-500/30 rounded-xl bg-[#000d1a]">
        <p className="text-slate-500 text-sm">Waiting for votes...</p>
        <p className="text-xs text-slate-600 mt-2 font-mono">{collectorWallet}</p>
      </div>
    );
  }

  const recentVotes = [...votes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
  const votesLast60s = votes.filter(v => (Date.now() - new Date(v.createdAt).getTime()) < 60000).length;

  return (
    <div className="w-full bg-[#000d1a] border border-rose-500/15 rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 py-3 border-b border-rose-500/10 flex justify-between items-center bg-[#001224]">
        <h3 className="text-sm font-semibold text-slate-200">Live Transaction Feed</h3>
        {votesLast60s > 0 && (
          <span className="badge badge-rose animate-pulse">
            {votesLast60s} in last 60s
          </span>
        )}
      </div>
      <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {recentVotes.map((vote, idx) => (
          <div 
            key={vote.txHash} 
            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-rose-500/40 transition-colors animate-voteFlash"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex flex-col">
              <span className="text-xs font-mono-hash truncate w-32 sm:w-48 text-violet-300">
                {vote.voterWallet}
              </span>
              <span className="text-sm font-medium text-slate-200 mt-0.5">
                Voted for: <span className="text-rose-400">{vote.optionMemo || 'Option'}</span>
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 mb-1">
                {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
              </span>
              <a 
                href={`/verify/${vote.txHash}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                Verify <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
