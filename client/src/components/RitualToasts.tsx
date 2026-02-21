import React from 'react';
import { useApp } from '../context/AppContext';

const RitualToasts: React.FC = () => {
  const { state } = useApp();
  // Using events as notifications for mockup
  const notifications = state.events.slice(0, 3);

  return (
    <div className="fixed bottom-10 right-10 z-[110] space-y-4 w-[320px] pointer-events-none">
      {notifications.map((n, i) => (
        <div 
          key={i}
          className="pointer-events-auto glass p-5 rounded-2xl border border-white/10 bg-white/5 flex items-start gap-4 shadow-2xl animate-in slide-in-from-right duration-500 cursor-pointer group hover:scale-[1.02] transition-transform"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-amber-400 bg-amber-500/10">
            ℹ️
          </div>
          <div className="flex-grow">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
              Ritual Log
            </p>
            <p className="text-xs font-medium text-slate-200 leading-relaxed">{n.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RitualToasts;
