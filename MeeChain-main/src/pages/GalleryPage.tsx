
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppState';
import { MeeBot } from '../types';

const GalleryPage: React.FC = () => {
  const { state, setGalleryFilter } = useApp();
  const [localDropdownOpen, setLocalDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoading = state.loadingStates.gallery;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLocalDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNfts = useMemo(() => {
    if (state.galleryFilter === 'All') return state.myBots;
    return state.myBots.filter(nft => nft.rarity === state.galleryFilter);
  }, [state.myBots, state.galleryFilter]);

  const filterOptions = [
    { label: 'ALL UNITS', value: 'All' },
    { label: 'LEGENDARY', value: 'Legendary', color: 'text-amber-500' },
    { label: 'EPIC', value: 'Epic', color: 'text-purple-500' },
    { label: 'COMMON', value: 'Common', color: 'text-sky-500' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-2.5 h-12 bg-amber-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.5)]"></span>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
              The <span className="text-amber-500">Sanctum</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
            Mechanical Archive — Accessing the Neural Collective. 
            Telemetry data synced from the Eternal Ledger including energy infusion and evolution phases.
          </p>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setLocalDropdownOpen(!localDropdownOpen)}
            className="w-full sm:w-72 bg-black/40 border-2 border-white/5 px-8 py-5 rounded-[2rem] flex items-center justify-between group hover:border-amber-500/30 transition-all shadow-xl"
          >
            <span className="text-xs font-black text-white tracking-widest uppercase italic font-mono">
              Sector: {state.galleryFilter.toUpperCase()}
            </span>
            <span className={`text-amber-500 transition-transform ${localDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {localDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-4 glass border border-white/10 rounded-[2rem] overflow-hidden z-[60] shadow-2xl animate-in slide-in-from-top-4">
              <div className="p-2 space-y-1">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setGalleryFilter(opt.value);
                      setLocalDropdownOpen(false);
                    }}
                    className={`w-full px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between hover:bg-white/5 font-mono ${
                      state.galleryFilter === opt.value ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400'
                    }`}
                  >
                    <span className={opt.color || ''}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {!state.account ? (
        <div className="glass p-32 rounded-[5rem] text-center border-white/5 flex flex-col items-center">
          <div className="w-32 h-32 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center text-5xl mb-10 border-2 border-amber-500/20">
            🔒
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 text-white leading-none">Neural Link Required</h2>
          <p className="text-slate-500 max-w-lg mb-12 font-medium">Authentication required to visualize the Mechanical Collective.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pb-32">
          {filteredNfts.map((nft) => (
            <div 
              key={nft.id} 
              className={`glass group overflow-hidden rounded-[3rem] border-2 border-white/5 transition-all duration-700 hover:-translate-y-4 relative flex flex-col bg-[#0a0f1a]/80 shadow-2xl`}
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-8 left-8 flex flex-col gap-3 z-20">
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-2xl border ${
                    nft.rarity === 'Legendary' ? 'bg-amber-500/30 text-amber-200 border-amber-500/50' :
                    nft.rarity === 'Epic' ? 'bg-purple-500/30 text-purple-200 border-purple-500/50' :
                    'bg-sky-500/30 text-sky-200 border-sky-500/50'
                  }`}>
                    {nft.rarity}
                  </span>
                </div>
                {nft.energyLevel > 0 && (
                  <div className="absolute top-8 right-8 z-20">
                    <span className="bg-amber-500/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl font-mono">
                      ENERGY: {nft.energyLevel}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-10 space-y-8 flex-grow">
                <div>
                  <h3 className="font-black text-4xl tracking-tighter uppercase italic text-white group-hover:text-amber-500 transition-colors leading-none">
                    {nft.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-3">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic font-mono">
                        {nft.energyLevel >= 50 ? 'Celestial' : nft.energyLevel >= 25 ? 'Quantum' : nft.energyLevel >= 10 ? 'Aura' : 'Neural'} Phase
                     </p>
                  </div>
                </div>

                {/* New Components Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">🛠️</span> Core Components
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {nft.components.map((component, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300 backdrop-blur-sm">
                        {component}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Telemetry Stats (formerly Telemetry Snapshot) */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="text-xl">📈</span> Telemetry Stats
                  </h4>
                  <div className="grid grid-cols-3 gap-6 font-mono">
                    {[
                      { label: 'PWR', value: Math.floor(nft.baseStats.power + nft.energyLevel * 1.5), color: 'bg-rose-500' },
                      { label: 'SPD', value: Math.floor(nft.baseStats.speed + nft.energyLevel * 1.2), color: 'bg-sky-500' },
                      { label: 'INT', value: Math.floor(nft.baseStats.intel + nft.energyLevel * 2.0), color: 'bg-emerald-500' }
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[8px] font-black text-slate-500">{stat.label}</span>
                          <span className="text-xs font-black text-white">{stat.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${stat.color} transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
                            style={{ width: `${Math.min((stat.value / 250) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => window.location.hash = '#/staking'}
                    className="flex-grow bg-white/5 hover:bg-white/10 text-[10px] font-black py-5 rounded-2xl transition-all uppercase tracking-[0.3em] border border-white/5 active:scale-95"
                  >
                    Open Rig ⚡
                  </button>
                  <button className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all text-xl">
                    📁
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
