'use client';

import Link from 'next/link';
import { ArrowUpRight, BarChart3, Users, Zap } from 'lucide-react';
import PollCard from '@/components/shared/PollCard';

export default function CreatorDashboard() {
  const stats = [
    { label: 'Total Active Polls', value: '3', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Total Ballots Cast', value: '1,284', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Avg Engagement Rate', value: '64%', icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  const recentPolls = [
    { id: '1', title: 'Q3 Product Priorities', status: 'active', optionsCount: 4, totalVotes: 142, created: new Date(), options: [{id:'1',label:'UI Sync'}, {id:'2',label:'Speed'}] },
    { id: '3', title: 'Q2 All-Hands Feedback', status: 'closed', optionsCount: 5, totalVotes: 89, created: new Date(Date.now() - 86400000), options: [{id:'1',label:'Yes'}, {id:'2',label:'No'}] },
  ];

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
          <div key={i} className="bg-[#000d1a] border border-cyan-500/15 rounded-xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-100 font-mono-hash">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-cyan-500/10">
            <h2 className="text-lg font-semibold text-slate-200">Recent Polls</h2>
            <Link href="/creator/polls" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} compact={true} />
            ))}
          </div>
        </div>

        {/* Sidebar Widgets Area */}
        <div className="space-y-6">
          <div className="bg-[#000d1a] border border-cyan-500/15 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-200 mb-4 tracking-wide uppercase">Quick Tips</h2>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                <p>Keep your option memos under 8 characters to save space on the Ledger transaction.</p>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <p>Embed the QR codes onto your presentation slides for live audience interactions.</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
