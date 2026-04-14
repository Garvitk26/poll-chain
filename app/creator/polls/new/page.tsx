'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ShieldAlert, ArrowRight } from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';

export default function NewPollPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requireWallet: true,
  });

  const [options, setOptions] = useState([
    { id: '1', label: '', memo: '' },
    { id: '2', label: '', memo: '' },
  ]);

  const handleAddOption = () => {
    if (options.length >= 10) {
      showToast('Maximum 10 options allowed', 'warning');
      return;
    }
    setOptions([...options, { id: Math.random().toString(), label: '', memo: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      showToast('Minimum 2 options required', 'warning');
      return;
    }
    setOptions(options.filter(o => o.id !== id));
  };

  const handleUpdateOption = (id: string, field: 'label' | 'memo', value: string) => {
    // strict formatting for memo to be uppercase max 28 chars (Stellar limit is 28 bytes)
    if (field === 'memo') {
      value = value.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 20);
    }
    setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Poll title is required', 'error');
      return;
    }
    const invalidOptions = options.filter(o => !o.label.trim() || !o.memo.trim());
    if (invalidOptions.length > 0) {
      showToast('All options must have a label and a memo', 'error');
      return;
    }

    setLoading(true);
    // Simulate API creation
    setTimeout(() => {
      setLoading(false);
      showToast('Poll successfully deployed to network!', 'success');
      router.push('/creator/polls/new_deployed_123');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Create a New Poll</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your poll parameters before deploying the collector wallet.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Details */}
        <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-6 md:p-8 shadow-lg">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">General Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Poll Title <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="e.g., Q3 Strategic Pivot"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description <span className="text-slate-500">(Optional)</span></label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[100px] resize-y"
                placeholder="Provide context on why this vote matters..."
                maxLength={500}
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-6 md:p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-200">Voting Options</h2>
            <span className="text-xs text-slate-500">{options.length}/10 slots used</span>
          </div>

          <div className="space-y-4 mb-6">
            {options.map((opt, i) => (
              <div key={opt.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-start p-4 border border-rose-500/10 rounded-lg bg-slate-800/20">
                <div className="w-full sm:flex-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Display Label</label>
                  <input
                    type="text"
                    value={opt.label}
                    onChange={e => handleUpdateOption(opt.id, 'label', e.target.value)}
                    className="input-field py-2 text-sm"
                    placeholder="e.g., Proceed with Pivot"
                    maxLength={50}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Stellar Memo <span className="text-[10px] ml-1 opacity-50">(max 20)</span></label>
                  <input
                    type="text"
                    value={opt.memo}
                    onChange={e => handleUpdateOption(opt.id, 'memo', e.target.value)}
                    className="input-field py-2 text-sm font-mono uppercase"
                    placeholder="e.g., PIVOT_YES"
                  />
                </div>
                <div className="pt-6 hidden sm:block">
                  <button 
                    type="button" 
                    onClick={() => handleRemoveOption(opt.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors h-10 w-10 flex items-center justify-center"
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Mobile remove */}
                <div className="w-full flex justify-end sm:hidden">
                  <button 
                    type="button" 
                    onClick={() => handleRemoveOption(opt.id)}
                    className="text-xs text-rose-400 flex items-center gap-1"
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={handleAddOption}
            disabled={options.length >= 10}
            className="w-full py-3 border border-dashed border-rose-500/30 rounded-lg text-rose-400 text-sm hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Add Another Option
          </button>
        </div>

        {/* Security Settings */}
        <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-6 md:p-8 shadow-lg">
          <h2 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-violet-400" /> Security Settings
          </h2>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-start pt-1">
              <input
                type="checkbox"
                checked={formData.requireWallet}
                onChange={e => setFormData({ ...formData, requireWallet: e.target.checked })}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-rose-500/30 rounded bg-[#001224] peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-colors after:content-[''] after:absolute after:hidden peer-checked:after:block after:left-1.5 after:top-1.5 after:w-2 after:h-2 after:bg-white after:rounded-sm"></div>
            </div>
            <div>
              <p className="font-medium text-slate-200">Require Valid Freighter Session</p>
              <p className="text-sm text-slate-500 mt-0.5">Voters must connect their Freighter wallet before interacting with the poll instead of just scanning a QR code.</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary py-3 px-8 text-lg w-full md:w-auto shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deploying to Network...
              </>
            ) : (
              <>
                Initialize Collector & Form <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
