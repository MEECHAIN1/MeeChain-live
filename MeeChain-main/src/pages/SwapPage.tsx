
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppState';
import { getSwapQuote, performSwap } from '../lib/services/swap';
import { ADRS } from '../lib/contracts';
import { triggerWarpRitual, triggerSuccessRitual } from '../lib/rituals';
import { parseEther } from 'viem';

const SwapPage: React.FC = () => {
  const { state, notify, setGlobalLoading, refreshBalances, addEvent } = useApp();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('0');
  const [slippage, setSlippage] = useState('0.5');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });

  const tokens = [
    { symbol: 'MCB', name: 'MeeChain Bot', address: ADRS.token, icon: '💎' },
    { symbol: 'sMCB', name: 'Staked MeeBot', address: ADRS.staking, icon: '💰' },
    { symbol: 'BNB', name: 'BNB Flux', address: '0x0000000000000000000000000000000000000000', icon: '⚡' }
  ];

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);

  const activeBalance = useMemo(() => {
    if (fromToken.symbol === 'MCB') return state.balances.token;
    if (fromToken.symbol === 'sMCB') return state.balances.staked;
    if (fromToken.symbol === 'BNB') return state.balances.native;
    return '0';
  }, [fromToken, state.balances]);

  useEffect(() => {
    const updateQuote = async () => {
      if (!fromAmount || Number(fromAmount) <= 0) {
        setToAmount('0');
        return;
      }
      // Simple mock quote if tokens are same, otherwise fetch
      if (fromToken.symbol === toToken.symbol) {
        setToAmount(fromAmount);
        return;
      }
      const quote = await getSwapQuote(fromAmount, [fromToken.address as `0x${string}`, toToken.address as `0x${string}`]);
      setToAmount(quote);
    };
    const timer = setTimeout(updateQuote, 500);
    return () => clearTimeout(timer);
  }, [fromAmount, fromToken, toToken]);

  const handleSwap = async () => {
    if (!state.account) return notify('error', 'Neural Link required for conversion.');
    if (Number(fromAmount) > Number(activeBalance)) return notify('error', 'Insufficient flux energy (Balance too low).');
    
    setGlobalLoading('general', true);
    setStatus({ type: 'loading', msg: `Initiating Flux Conversion: ${fromAmount} ${fromToken.symbol} → ${toToken.symbol}...` });
    triggerWarpRitual();

    try {
      const hash = await performSwap(
        fromAmount, 
        (Number(toAmount) * (1 - Number(slippage) / 100)).toString(),
        [fromToken.address as `0x${string}`, toToken.address as `0x${string}`],
        state.account
      );

      addEvent({
        type: 'Transfer',
        contract: 'Token',
        from: state.account,
        amount: `${fromAmount} ${fromToken.symbol} swapped for ${toAmount} ${toToken.symbol}`,
        hash
      });

      triggerSuccessRitual();
      setStatus({ type: 'success', msg: `Conversion Ritual Manifested! Received ${toAmount} ${toToken.symbol}.` });
      setFromAmount('');
      await refreshBalances();
    } catch (err) {
      setStatus({ type: 'error', msg: 'Flux conversion failed due to quantum turbulence.' });
    } finally {
      setGlobalLoading('general', false);
      setTimeout(() => setStatus({ type: 'idle', msg: '' }), 6000);
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 animate-in fade-in duration-1000">
      <header className="text-center space-y-2 sm:space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-sky-400">
          Flux <span className="text-white">Converter</span>
        </h1>
        <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] sm:tracking-[0.6em]">Neural Energy Exchange Protocol V3.2</p>
      </header>

      <div className="glass p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-white/5 relative overflow-hidden bg-gradient-to-br from-black/40 via-transparent to-black/20 shadow-2xl">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10 space-y-4 sm:space-y-6">
          {/* Input Panel */}
          <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] space-y-4 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Origin (From)</span>
              <span>Bal: {parseFloat(activeBalance).toFixed(2)} {fromToken.symbol}</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <input 
                type="number"
                inputMode="decimal"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-3xl sm:text-5xl font-black text-white focus:outline-none w-full placeholder:text-slate-800 tracking-tighter"
              />
              <div 
                onClick={() => {
                  const nextIdx = (tokens.findIndex(t => t.symbol === fromToken.symbol) + 1) % tokens.length;
                  setFromToken(tokens[nextIdx]);
                }}
                className="flex items-center gap-2 sm:gap-3 bg-white/5 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all flex-shrink-0"
              >
                <span className="text-xl sm:text-2xl">{fromToken.icon}</span>
                <span className="font-black text-xs sm:text-sm uppercase">{fromToken.symbol}</span>
              </div>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-6 sm:-my-8 relative z-20">
            <button 
              onClick={switchTokens}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 text-black rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-2xl hover:scale-110 active:scale-90 transition-all border-4 border-[#05080f] group"
            >
              <span className="group-hover:rotate-180 transition-transform duration-500">⇅</span>
            </button>
          </div>

          {/* Output Panel */}
          <div className="p-6 sm:p-8 bg-white/[0.03] border border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] space-y-4 hover:border-white/10 transition-all">
            <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Target (To)</span>
              <span>Expected Yield</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-3xl sm:text-5xl font-black text-slate-500 tracking-tighter w-full overflow-hidden truncate">
                {toAmount === '0' ? '0.00' : parseFloat(toAmount).toFixed(3)}
              </div>
              <div 
                onClick={() => {
                  const nextIdx = (tokens.findIndex(t => t.symbol === toToken.symbol) + 1) % tokens.length;
                  setToToken(tokens[nextIdx]);
                }}
                className="flex items-center gap-2 sm:gap-3 bg-white/5 px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all flex-shrink-0"
              >
                <span className="text-xl sm:text-2xl">{toToken.icon}</span>
                <span className="font-black text-xs sm:text-sm uppercase">{toToken.symbol}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleSwap}
            disabled={!fromAmount || state.loadingStates.general}
            className="w-full h-16 sm:h-24 bg-white text-black font-black text-sm sm:text-xl rounded-2xl sm:rounded-[2.5rem] shadow-2xl transition-all active:scale-95 disabled:opacity-20 uppercase tracking-[0.4em] sm:tracking-[0.5em] flex items-center justify-center gap-3 sm:gap-4 group border-b-4 sm:border-b-8 border-slate-300"
          >
            {state.loadingStates.general ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="group-hover:translate-x-2 transition-transform">⚡</span>
            )}
            CONVERT FLUX
          </button>
        </div>
      </div>

      {status.msg && (
        <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500 ${
          status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
          status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          <div className="text-2xl sm:text-3xl">{status.type === 'success' ? '🛸' : '⚙️'}</div>
          <p className="leading-relaxed">{status.msg}</p>
        </div>
      )}
    </div>
  );
};

export default SwapPage;
