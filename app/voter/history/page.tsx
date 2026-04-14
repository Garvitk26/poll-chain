'use client';

import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';

export default function VoterHistory() {
  const history = [
    { txHash: '2b4c...f9a1', pollTitle: 'Network Protocol Upgrade v2.0', memo: 'UPGRADE_YES', date: new Date(Date.now() - 3600000), status: 'success' },
    { txHash: '8a1f...3d4c', pollTitle: 'Q1 Interface Design', memo: 'OPTION_DARK', date: new Date(Date.now() - 86400000 * 2), status: 'success' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Voting History</h1>
      <p className="text-slate-400 text-sm">A permanent record of every choice you've made on-chain.</p>

      <div className="bg-[#000d1a] border border-violet-500/15 rounded-xl shadow-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#001224] border-b border-violet-500/10 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Poll Title</th>
                <th className="px-6 py-4 font-medium">Your Choice (Memo)</th>
                <th className="px-6 py-4 font-medium">Date Cast</th>
                <th className="px-6 py-4 font-medium text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/10 text-slate-300">
              {history.map((record, i) => (
                <tr key={i} className="hover:bg-violet-500/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{record.pollTitle}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded">
                      {record.memo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {formatDistanceToNow(record.date)} ago
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a 
                      href={`/verify/full-${record.txHash}`} 
                      className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded transition-colors"
                    >
                      Explorer <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
