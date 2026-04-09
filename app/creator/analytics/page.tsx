'use client';

export default function AnalyticsPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
         <span className="text-4xl font-mono-hash animate-pulse">#</span>
      </div>
      <h1 className="text-3xl font-bold gradient-text">Pro Analytics</h1>
      <p className="text-slate-400 max-w-lg leading-relaxed">
        Granular voter demographic analysis, timezone activity maps, and automated compliance reports will be unlocked in Phase V.
      </p>
    </div>
  );
}
