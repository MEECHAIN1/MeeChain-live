
import React from 'react';
import { useApp } from '../context/AppState';

const EventLogPage: React.FC = () => {
  const { events } = useApp();

  const handleExport = () => {
    // Replacer function to handle BigInt serialization
    const jsonString = JSON.stringify(events, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meebot-ritual-logs-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              Live <span className="text-emerald-400">Ledger</span>
            </h1>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Streaming</span>
            </div>
          </div>
          <p className="text-slate-400 font-medium max-w-lg">Monitoring the continuous ritual stream. Every block transition and neural interaction is recorded in the immutable ledger.</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-white/5 hover:bg-white/10 text-[10px] font-black px-6 py-3 rounded-xl border border-white/10 transition-all active:scale-95 uppercase tracking-widest"
        >
          Extract Data Packet
        </button>
      </header>

      <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black italic">
                <th className="px-8 py-6 border-b border-white/5">Time Vector</th>
                <th className="px-8 py-6 border-b border-white/5">Ritual Type</th>
                <th className="px-8 py-6 border-b border-white/5">Sector</th>
                <th className="px-8 py-6 border-b border-white/5">Telemetry Details</th>
                <th className="px-8 py-6 border-b border-white/5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {events.length > 0 ? events.map((event, index) => (
                <tr 
                  key={event.id} 
                  className={`hover:bg-white/[0.03] transition-colors group animate-in fade-in slide-in-from-top-4 duration-500 fill-mode-both ${index === 0 ? 'bg-emerald-500/[0.02]' : ''}`}
                >
                  <td className="px-8 py-6 text-xs font-mono text-slate-400">
                    <span className="opacity-40 font-sans mr-2">T-</span>
                    {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        event.type === 'Minted' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        event.type === 'Staked' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        event.type === 'Claimed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      }`}>
                        {event.type}
                      </span>
                      {index === 0 && (
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter animate-pulse">Just Manifested</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{event.contract}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-bold text-slate-200">{event.amount || `Object #${event.tokenId}`}</p>
                      <p className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase">Source: {event.from.slice(0, 16)}...</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a 
                      href={`https://explorer.meechain.com/tx/${event.hash}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 text-emerald-400/60 hover:text-emerald-400 font-black text-[10px] uppercase tracking-widest transition-colors group/link"
                    >
                      Verify <span className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform">↗</span>
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center text-slate-700 italic font-black uppercase tracking-[0.4em]">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <div className="w-12 h-12 border-2 border-dashed border-slate-700 rounded-full animate-spin"></div>
                      Awaiting ritual manifestations...
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 px-4">
        <p>Telemetry Buffer: {events.length} / 50 Rituals</p>
        <p>Sync Frequency: Real-Time Webhook</p>
      </div>
    </div>
  );
};

export default EventLogPage;
