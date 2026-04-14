'use client';

import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';

interface VoteChartProps {
  options: { id: string; label: string; memo: string }[];
  votes: any[];
  animate?: boolean;
}

export default function VoteChart({ options, votes, animate = false }: VoteChartProps) {
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (animate) setTrigger((prev) => prev + 1);
  }, [votes, animate]);

  const totalVotes = votes.length;
  
  const voteCounts = options.map(opt => ({
    ...opt,
    count: votes.filter(v => v.optionId === opt.id).length
  }));
  
  const sorted = [...voteCounts].sort((a, b) => b.count - a.count);
  const maxVotes = sorted.length > 0 ? sorted[0].count : 0;

  const colors = [
    'from-rose-500 to-rose-600',
    'from-violet-500 to-violet-600',
    'from-violet-500 to-violet-600',
    'from-pink-500 to-pink-600',
    'from-amber-500 to-amber-600',
    'from-rose-500 to-rose-600'
  ];

  return (
    <div className="w-full space-y-4" key={trigger}>
      {sorted.map((opt, i) => {
        const percent = totalVotes === 0 ? 0 : Math.round((opt.count / totalVotes) * 100);
        const isWinner = totalVotes > 0 && opt.count === maxVotes;
        
        return (
          <div key={opt.id} className="relative">
            <div className="flex justify-between items-end mb-1 text-sm">
              <span className={`font-medium flex items-center gap-1.5 ${isWinner ? 'text-slate-100' : 'text-slate-300'}`}>
                {isWinner && <Crown className="w-4 h-4 text-amber-400" />}
                {opt.label}
              </span>
              <span className="font-mono text-slate-400 text-xs">
                {opt.count} ({percent}%)
              </span>
            </div>
            <div className="w-full bg-[#001a33] rounded-sm h-3 overflow-hidden border left-0 border-rose-500/10">
              <div 
                className={`h-full bg-gradient-to-r ${colors[i % colors.length]} relative`}
                style={{ 
                  width: `${percent}%`,
                  animation: 'barFill 1s ease-out forwards'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
