import React from 'react';

const NetworkBanner: React.FC = () => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/70 italic">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
          <span>Sector Locked: MeeChain (ChainID: 56)</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="opacity-40">BNB-POWERED PROTOCOL</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkBanner;
