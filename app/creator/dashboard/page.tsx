'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BarChart3, Users, Zap } from 'lucide-react';
import PollCard from '@/components/shared/PollCard';
import WalletManager from '@/components/shared/WalletManager';
import SendXLMPanel from '@/components/shared/SendXLMPanel';
import { Activity } from 'lucide-react';

export default function CreatorDashboard() {
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

  const totalVotes = polls.reduce((acc, p) => acc + (p.totalVotes || 0), 0);
  
  const stats = [
    { label: 'Total Active Polls', value: polls.filter(p => p.status === 'active').length.toString(), icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Total Ballots Cast', value: totalVotes.toLocaleString(), icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Avg Engagement Rate', value: polls.length > 0 ? `${Math.round((totalVotes / (polls.length * 100)) * 100)}%` : '0%', icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  const recentPolls = polls.slice(0, 4);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Creator Dashboard</h1>
          <p className="text-slate-400 text-sm">Welcome back. Here's what's happening with your consensus network.</p>
        </div>
        <Link href="/creator/polls/new" className="btn-primary py-2 px-6 shadow-[0_0_15px_rgba(6,182,212,0.2)] whitespace-nowrap">
          Create New Poll
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-6 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-100 font-mono-hash">{stat.value}</p>
          </div>
        ))}
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
             <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10">
                <Activity size={32} className="animate-pulse" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Chain Synchronization</h3>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">Stellar Testnet Consensus Active<br/>Ledger Height Monitor Enabled</p>
             </div>
             <div className="w-full h-px bg-white/5" />
             <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Status: Operational</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-rose-500/10">
            <h2 className="text-lg font-semibold text-slate-200">Recent Polls</h2>
            <Link href="/creator/polls" className="text-sm text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentPolls.map(poll => (
              <PollCard key={poll._id} poll={poll} compact={true} />
            ))}
          </div>
        </div>

        {/* Sidebar Widgets Area */}
        <div className="space-y-6">
          <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-4 tracking-wide uppercase">Quick Tips</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <p>Keep your option memos under 8 characters to save space on the Ledger transaction.</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                <p>Embed the QR codes onto your presentation slides for live audience interactions.</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
