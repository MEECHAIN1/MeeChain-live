
import React from 'react';
import { useApp } from '../context/AppState';

const RitualToasts: React.FC = () => {
  const { state, removeNotification } = useApp();

  return (
    <div className="fixed bottom-10 right-10 z-[110] space-y-4 w-[320px] pointer-events-none">
      {state.notifications.map((n) => (
        <div 
          key={n.id}
          onClick={() => removeNotification(n.id)}
          className={`pointer-events-auto glass p-5 rounded-2xl border flex items-start gap-4 shadow-2xl animate-in slide-in-from-right duration-500 cursor-pointer group hover:scale-[1.02] transition-transform ${
            n.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' :
            n.type === 'error' ? 'border-rose-500/20 bg-rose-500/5' :
            n.type === 'prophecy' ? 'border-indigo-500/20 bg-indigo-500/5' :
            'border-white/10'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            n.type === 'success' ? 'text-emerald-400 bg-emerald-500/10' :
            n.type === 'error' ? 'text-rose-400 bg-rose-500/10' :
            n.type === 'prophecy' ? 'text-indigo-400 bg-indigo-500/10' :
            'text-slate-400'
          }`}>
            {n.type === 'success' ? '✨' : n.type === 'error' ? '⚠️' : n.type === 'prophecy' ? '🔮' : 'ℹ️'}
          </div>
          <div className="flex-grow">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">
              {n.type === 'prophecy' ? 'MeeBot Prophecy' : 'Ritual Log'}
            </p>
            <p className="text-xs font-medium text-slate-200 leading-relaxed">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RitualToasts;
