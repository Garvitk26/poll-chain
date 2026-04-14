'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import VoteChart from '@/components/shared/VoteChart';
import LiveVoteFeed from '@/components/shared/LiveVoteFeed';
import { useLiveResults } from '@/hooks/useLiveResults';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import QRCodeDisplay from '@/components/shared/QRCodeDisplay';

export default function ResultsPage({ params }: { params: { pollId: string } }) {
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chart' | 'feed' | 'share'>('chart');
  
  const { votes, results, totalVotes, loading: resultsLoading } = useLiveResults(params.pollId);

  useEffect(() => {
    fetch(`/api/polls/${params.pollId}`)
      .then(res => res.json())
      .then(data => {
        if (data.poll) {
          setPoll(data.poll);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.pollId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!poll) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-rose-500">Poll not found</p>
      </main>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/poll/${poll._id}` : '';

  return (
    <main className="min-h-[calc(100vh-64px)] py-8 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Link href={`/poll/${poll._id}`} className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 text-sm font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Voting
        </Link>

        {/* Header Header */}
        <div className="bg-[#001224] border border-rose-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`badge ${poll.status === 'active' ? 'badge-rose animate-pulse' : 'badge-violet'}`}>
                {poll.status === 'active' ? 'Live Results' : 'Final Results'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">{poll.title}</h1>
          </div>
          <div className="flex flex-col items-start md:items-end p-4 bg-[#000d1a] rounded-xl border border-violet-500/10">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Total Ballots Cast</span>
            <span className="text-3xl font-mono text-rose-400 font-bold">{totalVotes}</span>
          </div>
        </div>

        {/* Dynamic Content Tabs */}
        <div className="bg-[#000d1a] border border-rose-500/15 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b border-rose-500/10 bg-[#001224]">
            {[
              { id: 'chart', label: 'Aggregation' },
              { id: 'feed', label: 'Live Tx Feed' },
              { id: 'share', label: 'Share Link' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-rose-400 text-rose-400 bg-rose-500/5' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6 md:p-8 min-h-[400px]">
            {activeTab === 'chart' && (
              <div className="max-w-3xl mx-auto">
                <VoteChart options={poll.options} votes={votes || []} animate={true} />
              </div>
            )}
            
            {activeTab === 'feed' && (
              <div className="max-w-4xl mx-auto">
                <LiveVoteFeed pollId={poll._id} collectorWallet={poll.collectorWallet} />
              </div>
            )}

            {activeTab === 'share' && (
              <div className="flex flex-col items-center justify-center py-8">
                 <QRCodeDisplay data={shareUrl} label="Share this poll with your community" />
                 <div className="mt-8 bg-[#001224] border border-rose-500/10 rounded-lg p-4 flex items-center gap-4 max-w-lg w-full">
                   <input 
                     type="text" 
                     readOnly 
                     value={shareUrl} 
                     className="bg-[#000d1a] text-slate-300 font-mono text-sm px-3 py-2 w-full outline-none rounded border border-slate-800"
                   />
                 </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
