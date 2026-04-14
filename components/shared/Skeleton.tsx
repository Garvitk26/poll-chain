'use client';

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-slate-800/40 via-rose-900/20 to-slate-800/40 rounded-md ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number, className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`p-6 bg-[#000d1a] border border-rose-500/10 rounded-xl ${className}`}>
      <div className="flex gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-1/3 h-5 mb-2" />
          <Skeleton className="w-1/4 h-3" />
        </div>
      </div>
      <SkeletonText lines={2} className="mb-4" />
      <Skeleton className="w-full h-8" />
    </div>
  );
}

export function SkeletonAvatar({ size = 10, className }: { size?: number, className?: string }) {
  return (
    <Skeleton className={`w-${size} h-${size} rounded-full ${className}`} />
  );
}
