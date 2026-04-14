'use client';

import { Skeleton, SkeletonCard, SkeletonText } from './Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="w-48 h-8 mb-2" />
          <Skeleton className="w-64 h-4" />
        </div>
        <Skeleton className="w-32 h-10 rounded-md" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-[#000d1a] border border-rose-500/10 rounded-xl relative overflow-hidden">
             <Skeleton className="w-8 h-8 rounded-md mb-4" />
             <Skeleton className="w-16 h-4 mb-2" />
             <Skeleton className="w-24 h-8" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart section */}
        <div className="lg:col-span-2 p-6 bg-[#000d1a] border border-rose-500/10 rounded-xl">
          <Skeleton className="w-1/4 h-6 mb-6" />
          <div className="flex items-end gap-2 h-64 border-b border-rose-500/10 pb-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton 
                key={i} 
                className="flex-1 rounded-t-md" 
                style={{ height: `${Math.max(20, Math.random() * 100)}%` }} 
              />
            ))}
          </div>
        </div>

        {/* Sidebar activity / table section */}
        <div className="p-6 bg-[#000d1a] border border-rose-500/10 rounded-xl">
           <Skeleton className="w-1/3 h-6 mb-6" />
           <div className="space-y-6">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex gap-4">
                 <Skeleton className="w-10 h-10 rounded-full" />
                 <div className="flex-1">
                   <Skeleton className="w-full h-4 mb-2" />
                   <Skeleton className="w-1/2 h-3" />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
