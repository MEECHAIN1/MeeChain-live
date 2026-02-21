import React from 'react';
import { useApp } from '../context/AppContext';

const GlobalLoadingOverlay: React.FC = () => {
  const { state } = useApp();
  // Simplified for mockup
  const active = state.isLoading;

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="text-center space-y-8 p-10">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-2 border-amber-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-6 bg-amber-500/5 rounded-full flex items-center justify-center">
             <span className="text-3xl animate-pulse">⚡</span>
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black italic uppercase tracking-[0.2em] text-white">
            Processing Ritual
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 animate-pulse">
            Waiting for Ledger Verification...
          </p>
        </div>
        <div className="pt-4">
           <p className="text-[8px] text-slate-500 uppercase font-mono italic">Do not sever the link during conversion</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
