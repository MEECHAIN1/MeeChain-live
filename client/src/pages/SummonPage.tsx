
import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppState';
import { triggerSuccessRitual, triggerCelestialRitual, triggerMintRitual } from '../lib/rituals';
import { generateMeeBotName } from '../lib/meeBotNames';

const SummonPage: React.FC = () => {
  const { state, notify, addBot, updateLuckiness, spendGems, addEvent, setGlobalLoading } = useApp();
  const [isSummoning, setIsSummoning] = useState(false);
  const [lastResult, setLastResult] = useState<any[]>([]);

  const handleSummon = async (count: number) => {
    if (!state.account) return notify('error', 'Neural Link required for summoning.');
    const cost = count; // 1 gem per summon for simplicity based on prompt description
    
    if (state.balances.gems < cost) {
      return notify('error', 'Insufficient Gems for manifestation protocol.');
    }

    setIsSummoning(true);
    setGlobalLoading('general', true);
    triggerCelestialRitual();

    // Simulation delay
    await new Promise(r => setTimeout(r, 2000));

    if (spendGems(cost)) {
      const results: any[] = [];
      for (let i = 0; i < count; i++) {
        const tokenId = Math.floor(Math.random() * 9000) + 5000;
        const rarityRoll = Math.random() * 100;
        // Guaranteed Legendary at 100 luck
        const isGuaranteed = state.balances.luckiness >= 100;
        
        let rarity: "Common" | "Epic" | "Legendary" = "Common";
        if (isGuaranteed || rarityRoll > 95) rarity = "Legendary";
        else if (rarityRoll > 75) rarity = "Epic";

        const newBot = {
          id: tokenId.toString(),
          name: generateMeeBotName(tokenId.toString()),
          rarity,
          energyLevel: 0,
          stakingStart: null,
          isStaking: false,
          image: `https://picsum.photos/seed/meebot_summon_${tokenId}/1024/1024`,
          baseStats: {
            power: 45 + Math.random() * 30,
            speed: 45 + Math.random() * 30,
            intel: 45 + Math.random() * 30
          },
          components: rarity === "Legendary" 
            ? ["Crystalline Hull", "Fusion Core", "Singularity Drive", "Omni-Senses"]
            : rarity === "Epic"
            ? ["Refined Plate", "Overclocked Core", "Enhanced Senses"]
            : ["Standard Plate", "Neural Core", "Basic Senses"]
        };

        addBot(newBot);
        results.push(newBot);

        addEvent({
          type: 'Minted',
          contract: 'NFT',
          from: '0x0000000000000000000000000000000000000000',
          to: state.account,
          tokenId: tokenId.toString(),
          hash: `0x${Math.random().toString(16).slice(2, 66)}`
        });
      }

      setLastResult(results);
      updateLuckiness(count * 5); // Increase luck per summon
      
      triggerSuccessRitual();
      triggerMintRitual();
      notify('success', `Manifestation successful: ${results.length} Spirit(s) anchored.`);
    }

    setIsSummoning(false);
    setGlobalLoading('general', false);
  };

  const potentialRewards = [
    { name: 'Radiant Edge', icon: '⚔️', color: 'bg-amber-500/20 border-amber-500/50' },
    { name: 'Mjolnir Core', icon: '🔨', color: 'bg-sky-500/20 border-sky-500/50' },
    { name: 'Battle Axe', icon: '🪓', color: 'bg-emerald-500/20 border-emerald-500/50' },
    { name: 'Solar Spear', icon: '🔱', color: 'bg-rose-500/20 border-rose-500/50' },
    { name: 'Void Shield', icon: '🛡️', color: 'bg-indigo-500/20 border-indigo-500/50' },
    { name: 'Eternal Tome', icon: '📕', color: 'bg-purple-500/20 border-purple-500/50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32 animate-in fade-in duration-1000">
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none">
          Treasure of <span className="text-sky-400">Fish Sun</span>
        </h1>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Neonova Manifestation Protocol</p>
      </header>

      {/* Rewards Row */}
      <div className="flex justify-center gap-4 py-4 overflow-x-auto custom-scrollbar px-4">
        {potentialRewards.map((reward, i) => (
          <div key={i} className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 ${reward.color} flex items-center justify-center text-2xl sm:text-3xl relative group`}>
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
             {reward.icon}
             <div className="absolute -top-1 -left-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center text-[8px] font-black">R</div>
          </div>
        ))}
      </div>

      {/* Central Portal */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-72 h-72 sm:w-96 sm:h-96">
          {/* Energy Rings */}
          <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute inset-8 border-2 border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
          <div className="absolute inset-16 border border-sky-400/10 rounded-full"></div>
          
          {/* Main Orb */}
          <div className={`absolute inset-12 rounded-full shadow-[0_0_100px_rgba(56,189,248,0.3)] flex items-center justify-center overflow-hidden transition-all duration-1000 ${isSummoning ? 'scale-125' : 'scale-100'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/40 via-indigo-600/40 to-transparent animate-pulse"></div>
            <div className="relative z-10 text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
              {isSummoning ? '⚡' : '🌌'}
            </div>
          </div>

          {/* Glowing Accents */}
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rotate-45 shadow-[0_0_20px_#f59e0b]"></div>
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rotate-45 shadow-[0_0_20px_#f59e0b]"></div>
        </div>

        {/* Progress Section */}
        <div className="mt-12 w-full max-w-md space-y-4 px-6">
          <div className="bg-black/40 border border-white/5 px-6 py-2 rounded-full flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Luckiness: {state.balances.luckiness} / 100</span>
            </div>
            <span className="text-amber-500">🔮</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-sky-500 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              style={{ width: `${Math.min(state.balances.luckiness, 100)}%` }}
            ></div>
          </div>
          <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-widest italic animate-pulse">
            {state.balances.luckiness >= 100 ? 'R-Grade Manifestation Guaranteed' : `Guaranteed in ${100 - state.balances.luckiness} more resonance units`}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center px-6">
        <button 
          onClick={() => handleSummon(1)}
          disabled={isSummoning}
          className="relative group w-full sm:w-64 h-24 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-indigo-700 skew-x-[-12deg] transition-transform group-hover:scale-105 active:scale-95 shadow-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-white h-full font-mono">
            <span className="text-xl font-black tracking-tighter italic">TREASURE x1</span>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-lg">💎</span>
               <span className="text-sm font-black">1</span>
            </div>
          </div>
        </button>

        <button 
          onClick={() => handleSummon(10)}
          disabled={isSummoning}
          className="relative group w-full sm:w-64 h-24 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 skew-x-[12deg] transition-transform group-hover:scale-105 active:scale-95 shadow-2xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-black h-full font-mono">
            <span className="text-xl font-black tracking-tighter italic">TREASURE x10</span>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-lg">💎</span>
               <span className="text-sm font-black">10</span>
            </div>
          </div>
        </button>
      </div>

      {/* Wallet Display */}
      <div className="flex justify-center">
         <div className="glass px-8 py-3 rounded-2xl flex items-center gap-6 border border-white/10">
            <div className="flex items-center gap-3">
               <span className="text-xl">💎</span>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Available Gems</span>
                  <span className="text-sm font-black text-white">{state.balances.gems}</span>
               </div>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex items-center gap-3">
               <span className="text-xl">🖼️</span>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase">Bot Count</span>
                  <span className="text-sm font-black text-white">{state.myBots.length}</span>
               </div>
            </div>
         </div>
      </div>

      {/* Last Result Grid */}
      {lastResult.length > 0 && !isSummoning && (
        <div className="glass p-10 rounded-[3rem] border-white/5 animate-in zoom-in-95 duration-700">
           <h3 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Recent Manifestations</h3>
           <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {lastResult.map((bot, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                   <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 overflow-hidden transition-all group-hover:scale-110 ${
                     bot.rarity === 'Legendary' ? 'border-amber-500 shadow-[0_0_10px_#f59e0b]' :
                     bot.rarity === 'Epic' ? 'border-purple-500' : 'border-white/10'
                   }`}>
                      <img src={bot.image} alt={bot.name} className="w-full h-full object-cover" />
                   </div>
                   <span className="text-[7px] font-black text-slate-500 uppercase truncate w-full text-center">{bot.name}</span>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default SummonPage;
