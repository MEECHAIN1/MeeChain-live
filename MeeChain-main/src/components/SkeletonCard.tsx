
import React from 'react';

export const SkeletonStat: React.FC = () => (
  <div className="glass p-6 rounded-[2rem] border-white/5 animate-pulse">
    <div className="h-2 w-20 bg-white/10 rounded mb-4"></div>
    <div className="flex items-baseline gap-2">
      <div className="h-10 w-24 bg-white/5 rounded-xl"></div>
      <div className="h-4 w-8 bg-white/5 rounded"></div>
    </div>
  </div>
);

export const SkeletonRow: React.FC = () => (
  <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 animate-pulse">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-full bg-white/5"></div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-white/10 rounded"></div>
        <div className="h-2 w-32 bg-white/5 rounded"></div>
      </div>
    </div>
    <div className="h-8 w-8 rounded-lg bg-white/5"></div>
  </div>
);
