'use client';

import { useState, useEffect } from 'react';
import { Settings, Lock, FileX, Download } from 'lucide-react';
import QRCodeDisplay from '@/components/shared/QRCodeDisplay';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';

export default function ActivePollManagement({ params }: { params: { pollId: string } }) {
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await fetch(`/api/polls/${params.pollId}`);
        const data = await res.json();
        if (data.poll) setPoll(data.poll);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [params.pollId]);

  const handleClose = async () => {
    if (!confirm('Are you sure you want to close this poll? This will finalize all on-chain results.')) return;
    try {
      const res = await fetch(`/api/polls/${params.pollId}/close`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPoll({ ...poll, status: 'closed' });
      }
    } catch (err) {
      alert('Failed to close poll');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this poll record? Actions cannot be reversed.')) return;
    try {
      const res = await fetch(`/api/polls/${params.pollId}`, { method: 'DELETE' });
      if (res.ok) window.location.href = '/creator/polls';
    } catch (err) {
      alert('Failed to delete poll');
    }
  };

  if (loading) return <DashboardSkeleton />;
  if (!poll) return <p className="text-rose-500">Not found</p>;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/poll/${poll.id}` : '';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className={`badge ${poll.status === 'active' ? 'badge-rose animate-pulse' : 'badge-slate'} mb-2 inline-block`}>
            {poll.status.toUpperCase()}
          </span>
          <h1 className="text-2xl font-bold text-slate-100">{poll.title}</h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary py-2 px-4 shadow-none" onClick={() => window.location.href=`/results/${poll._id}`}>View Results</button>
          {poll.status === 'active' && (
             <button 
               onClick={handleClose}
               className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
             >
               <Lock className="w-4 h-4" /> Close Poll
             </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Details Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-violet-400" /> Operational Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Collector Address</span>
                <p className="font-mono text-sm text-rose-400 bg-rose-900/10 border border-rose-500/20 p-2 rounded truncate select-all">{poll.collectorWallet}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Votes Received</span>
                <p className="font-mono text-2xl font-bold text-slate-200">{poll.totalVotes}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-rose-500/10 pt-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Option Code Mapping</h3>
              <div className="space-y-3 relative">
                {poll.options.map((opt: any) => (
                  <div key={opt.id} className="flex items-center justify-between p-3 bg-[#001224] border border-slate-800 rounded-lg">
                    <span className="text-slate-200 text-sm font-medium">{opt.label}</span>
                    <span className="font-mono text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">{opt.memo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action / Share Panel */}
        <div className="space-y-6">
          <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl flex flex-col items-center p-6 text-center">
             <h2 className="text-sm font-semibold text-slate-200 mb-4">Participant Access</h2>
             <QRCodeDisplay data={shareUrl} size={150} />
             <div className="w-full mt-4">
                <input 
                  readOnly 
                  value={shareUrl} 
                  className="w-full bg-[#001224] text-xs font-mono text-slate-400 border border-rose-500/10 px-3 py-2 rounded text-center outline-none select-all"
                />
             </div>
          </div>

          <div className="bg-rose-900/10 border border-rose-500/15 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-rose-400 mb-2 flex items-center gap-2">
              <FileX className="w-4 h-4" /> Danger Zone
            </h2>
            <p className="text-xs text-slate-400 mb-4">Deleting this off-chain tracking record will drop visibility from the dashboard, but you cannot delete the immutable Stellar transactions.</p>
            <button 
              onClick={handleDelete}
              className="w-full py-2 bg-transparent border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded text-sm transition-colors font-medium"
            >
              Delete Record
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
