
import React, { useMemo } from 'react';
import { useApp } from '../context/AppState';
import { triggerSuccessRitual } from '../lib/rituals';
import { MeeBot } from '../types';

const StakingRigCard: React.FC<{ bot: MeeBot }> = ({ bot }) => {
  const { toggleBotStaking } = useApp();

  const tier = useMemo(() => {
    if (bot.energyLevel >= 50) return { label: 'Celestial Sanctum', color: 'text-amber-400', aura: 'shadow-[0_0_50px_rgba(245,158,11,0.4)]', icon: '🌌', borderColor: 'border-amber-500/40' };
    if (bot.energyLevel >= 25) return { label: 'Quantum Pulse', color: 'text-indigo-400', aura: 'shadow-[0_0_40px_rgba(129,140,248,0.3)]', icon: '🌀', borderColor: 'border-indigo-500/30' };
    if (bot.energyLevel >= 10) return { label: 'Aura Glow', color: 'text-emerald-400', aura: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]', icon: '✨', borderColor: 'border-emerald-500/30' };
    return { label: 'Neural Base', color: 'text-slate-500', aura: 'shadow-none', icon: '🛡️', borderColor: 'border-white/10' };
  }, [bot.energyLevel]);

  // Dynamic stat calculation based on MCB energy infusion
  const stats = {
    pwr: Math.floor(bot.baseStats.power + bot.energyLevel * 1.5),
    spd: Math.floor(bot.baseStats.speed + bot.energyLevel * 1.2),
    int: Math.floor(bot.baseStats.intel + bot.energyLevel * 2.0),
  };

  return (
    <div className={`glass group overflow-hidden rounded-[2rem] border ${tier.borderColor} transition-all duration-1000 relative flex flex-col bg-[#0a0f1a]/80 shadow-2xl p-5 gap-6 ${tier.aura}`}>
      
      {/* Rig Chamber (Visual Section) */}
      <div className="relative w-full aspect-square md:aspect-[4/3] overflow-hidden rounded-2xl bg-black/40 border border-white/5">
        <img 
          src={bot.image} 
          alt={bot.name} 
          className={`w-full h-full object-cover transition-all duration-[3000ms] ${bot.isStaking ? 'brightness-125 scale-110 sepia-[0.1] saturate-[1.2]' : 'brightness-75 grayscale-[0.2]'}`} 
        />
        
        {/* Active MCB Infusion Overlay */}
        {bot.isStaking && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-amber-500/5 animate-pulse"></div>
            <div className="absolute top-4 right-4 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/30 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Infusing MCB</span>
            </div>
            {/* Visual MCB Flux Bars */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-1 items-end h-12 opacity-30">
               {[...Array(20)].map((_, i) => (
                 <div key={i} className="flex-grow bg-amber-500 rounded-t-sm" style={{ height: `${Math.random() * 100}%`, animation: `flux-pulse ${0.5 + Math.random()}s infinite alternate` }}></div>
               ))}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/40 to-transparent z-20">
          <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-1 ${tier.color}`}>
            {tier.icon} {tier.label}
          </p>
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter group-hover:text-amber-500 transition-colors">
            {bot.name}
          </h3>
        </div>
      </div>

      {/* Telemetry & Control (Data Section) */}
      <div className="flex-grow space-y-6 px-2 pb-2">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">Energy Flux</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-500 font-mono tracking-tighter leading-none">{bot.energyLevel}</span>
              <span className="text-[10px] font-black text-slate-600 uppercase">MCB</span>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 font-mono">Stability</p>
             <div className="flex gap-1 justify-end">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-1 h-3 rounded-full ${bot.isStaking ? (i < 4 ? 'bg-emerald-500' : 'bg-white/10') : 'bg-white/5'}`}></div>
                ))}
             </div>
          </div>
        </div>

        {/* Dynamic Telemetry Bars with MCB scaling */}
        <div className="space-y-4 font-mono">
          {[
            { label: 'PWR', val: stats.pwr, color: 'from-rose-500 to-amber-500', icon: '⚔️' },
            { label: 'SPD', val: stats.spd, color: 'from-sky-500 to-indigo-500', icon: '⚡' },
            { label: 'INT', val: stats.int, color: 'from-emerald-500 to-amber-500', icon: '🧠' }
          ].map(stat => (
            <div key={stat.label} className="space-y-1">
              <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-2">{stat.icon} {stat.label}</span>
                <span className="text-white">{stat.val}<span className="text-slate-700">/250</span></span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-sm overflow-hidden border border-white/5">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)]`} 
                  style={{ width: `${Math.min((stat.val / 250) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => {
            toggleBotStaking(bot.id);
            if (!bot.isStaking) triggerSuccessRitual();
          }}
          className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.5em] transition-all active:scale-95 border-b-4 ${
            bot.isStaking 
              ? 'bg-rose-600/10 text-rose-500 border-rose-900 hover:bg-rose-600/20' 
              : 'bg-white text-black border-slate-300 hover:bg-amber-50'
          }`}
        >
          {bot.isStaking ? 'Deactivate Rig' : 'Activate Rig'}
        </button>
      </div>

      <style>{`
        @keyframes flux-pulse {
          from { opacity: 0.2; transform: scaleY(0.8); }
          to { opacity: 0.8; transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
};

const StakingPage: React.FC = () => {
  const { state } = useApp();

  const activeRigs = state.myBots.filter(b => b.isStaking).length;
  const totalMCBGenerated = state.myBots.reduce((acc, b) => acc + b.energyLevel, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                ⚡
             </div>
             <div>
                <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Staking <span className="text-amber-500">Rig</span>
                </h1>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3 font-mono">MCB Infusion Protocol v4.0.2</p>
             </div>
          </div>
          <p className="text-slate-400 font-medium max-w-xl leading-relaxed">
            Commit your mechanical units to the infusion rigs to accumulate **MCB Energy**. 
            Accumulated energy triggers neural evolution, permanently boosting combat telemetry and unlocking higher-tier machine spirits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow lg:max-w-2xl">
          {[
            { label: 'Active Rigs', val: activeRigs, unit: 'UNITS', color: 'text-amber-500', icon: '⚙️' },
            { label: 'MCB Accumulated', val: totalMCBGenerated, unit: 'MCB', color: 'text-white', icon: '🔋' },
            { label: 'Infusion Rate', val: (activeRigs * 0.1 * 360).toFixed(1), unit: 'MCB/HR', color: 'text-emerald-500', icon: '📈' },
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-3xl border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-xl font-mono">
               <div className="flex justify-between items-center mb-3">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                 <span className="text-xs opacity-20">{stat.icon}</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.val}</span>
                 <span className="text-[9px] font-bold text-slate-600 uppercase">{stat.unit}</span>
               </div>
            </div>
          ))}
        </div>
      </header>

      {!state.account ? (
        <div className="glass p-32 rounded-[5rem] text-center border-white/5 flex flex-col items-center">
          <div className="w-32 h-32 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-5xl mb-10 border-2 border-amber-500/20 animate-pulse">
            🔒
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 text-white">Neural Link Restricted</h2>
          <p className="text-slate-500 max-w-lg mb-12 font-medium">Authentication required to access the MCB Infusion Rigs. Establish Neural Link to continue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {state.myBots.map(bot => (
            <StakingRigCard key={bot.id} bot={bot} />
          ))}
        </div>
      )}

      {/* Evolution Roadmap Section for MCB Transcendence */}
      <section className="glass p-16 rounded-[4rem] border-white/5 space-y-16 relative overflow-hidden bg-gradient-to-br from-black/40 to-transparent">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
           <span className="text-[15rem] font-black leading-none font-mono">MCB_V4</span>
        </div>
        
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Evolution <span className="text-amber-500">Thresholds</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] font-mono">The path to MCB transcendence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 font-mono">
          {[
            { threshold: 10, label: 'Aura Glow', desc: 'The Machine Spirit manifests a physical radiance. Base MCB Power and Intelligence increased significantly.', icon: '✨', color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
            { threshold: 25, label: 'Quantum Pulse', desc: 'Neural circuits sync with the higher void. MCB Flow surged by 30%. Unlocks predictive tactical telemetry.', icon: '🌀', color: 'text-indigo-500', bg: 'bg-indigo-500/5' },
            { threshold: 50, label: 'Celestial Sanctum', desc: 'Ultimate MCB evolution. The unit transcends the rig, existing as a data-god in the sanctum.', icon: '🌌', color: 'text-amber-500', bg: 'bg-amber-500/5' }
          ].map(tier => (
            <div key={tier.threshold} className={`p-10 ${tier.bg} rounded-[3rem] border border-white/5 space-y-6 text-center group hover:scale-105 transition-all duration-500 hover:border-white/20`}>
              <div className="text-7xl mb-4 group-hover:rotate-12 transition-transform">{tier.icon}</div>
              <div className="space-y-2">
                <p className={`${tier.color} font-black text-5xl tracking-tighter`}>{tier.threshold}</p>
                <h4 className="text-white font-black uppercase italic text-xl tracking-widest">{tier.label}</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-bold tracking-tight px-4">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StakingPage;
