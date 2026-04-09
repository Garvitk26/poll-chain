'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import VoteChart from './VoteChart';

interface PollCardProps {
  poll: any;
  showResults?: boolean;
  compact?: boolean;
}

export default function PollCard({ poll, showResults = false, compact = false }: PollCardProps) {
  const isDraft = poll.status === 'draft';
  const isActive = poll.status === 'active';
  const isClosed = poll.status === 'closed';

  let borderClass = 'border-slate-800';
  let badgeColor = 'bg-slate-800 text-slate-300';
  let StatusIcon = CheckCircle2;

  if (isActive) {
    borderClass = 'border-cyan-500/30';
    badgeColor = 'badge-cyan animate-pulse';
    StatusIcon = PlayCircle;
  } else if (isClosed) {
    borderClass = 'border-violet-500/30';
    badgeColor = 'badge-violet';
    StatusIcon = CheckCircle2;
  } else if (isDraft) {
    badgeColor = 'badge-slate bg-slate-800 text-slate-300';
    StatusIcon = Clock;
  }

  const badgeText = poll.status.charAt(0).toUpperCase() + poll.status.slice(1);

  return (
    <div className={`card-surface card-hover ${borderClass} flex flex-col p-5`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`badge flex items-center gap-1.5 ${badgeColor}`}>
          <StatusIcon className="w-3 h-3" />
          {badgeText}
        </span>
        <div className="flex gap-1.5">
          {poll.tags && poll.tags.slice(0, 2).map((tag: string) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-slate-800/50 text-slate-400 rounded-md border border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h3 className={`text-lg font-bold mb-2 line-clamp-1 ${isActive ? 'gradient-text' : 'text-slate-100'}`}>
        {poll.title}
      </h3>
      
      {!compact && (
        <p className="text-sm text-slate-400 mb-5 line-clamp-2 min-h-[40px]">
          {poll.description || 'No description provided.'}
        </p>
      )}

      {!showResults && (
        <div className="flex flex-wrap gap-2 mb-6">
          {poll.options && poll.options.slice(0, 3).map((opt: any, i: number) => {
            const colors = ['bg-cyan-500/20 text-cyan-400 border-cyan-500/30', 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', 'bg-violet-500/20 text-violet-400 border-violet-500/30'];
            return (
              <span key={opt.id} className={`text-xs px-2.5 py-1 rounded-full border ${colors[i % colors.length]}`}>
                {opt.label}
              </span>
            );
          })}
          {poll.options && poll.options.length > 3 && (
            <span className="text-xs px-2 py-1 text-slate-500">+ {poll.options.length - 3} more</span>
          )}
        </div>
      )}

      {showResults && (
        <div className="mb-6 h-32 overflow-hidden">
          <VoteChart 
            options={poll.options} 
            votes={poll._votes || []} 
            animate={false} 
          />
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Votes</span>
          <span className="text-sm font-mono text-cyan-400 animate-countPulse">
            {poll.totalVotes?.toLocaleString() || 0}
          </span>
        </div>
        
        {isActive ? (
          <Link href={`/poll/${poll._id}`} className="btn-primary text-xs py-1.5 px-4 shadow-none">
            Vote Now
          </Link>
        ) : (
          <Link href={`/results/${poll._id}`} className="btn-secondary text-xs py-1.5 px-4">
            See Results
          </Link>
        )}
      </div>
    </div>
  );
}
