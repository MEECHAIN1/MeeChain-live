
import React, { useState, useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { useApp } from '../context/AppState';
import { triggerSuccessRitual } from '../lib/rituals';

/**
 * WalletConnectButton Component
 * Handles the connection ritual for linking the user's neural identity (wallet).
 */
// Fix: Added missing implementation and export default to resolve import errors in Navbar.tsx
const WalletConnectButton: React.FC = () => {
  const { state, connectWallet, disconnectWallet } = useApp();
  const { connectors } = useConnect();
  const { isConnected } = useAccount();
  const [showConnectors, setShowConnectors] = useState(false);

  // Check if window.ethereum exists for the injected connector
  const hasInjected = typeof window !== 'undefined' && !!(window as any).ethereum;

  const handleConnect = async (connector: any) => {
    setShowConnectors(false);
    await connectWallet(connector);
  };

  // Close modal when connected
  useEffect(() => {
    if (isConnected) {
      setShowConnectors(false);
    }
  }, [isConnected]);

  if (state.account) {
    return (
      <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 pl-4 pr-2 py-2 rounded-2xl group hover:border-white/20 transition-all">
        <div className="hidden sm:block text-right">
          <p className="text-[7px] text-slate-600 font-black uppercase tracking-[0.3em] mb-0.5">Linked Identity</p>
          <p className="text-[10px] font-mono font-black text-white group-hover:text-amber-500 transition-colors">
            {state.account.slice(0, 6)}...{state.account.slice(-4)}
          </p>
        </div>
        <button 
          onClick={() => {
            disconnectWallet();
            triggerSuccessRitual();
          }}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center text-slate-500 transition-all active:scale-90"
          title="Sever Neural Link"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowConnectors(true)}
        disabled={state.isConnecting}
        className="relative overflow-hidden bg-white text-black px-8 py-3 rounded-2xl font-black text-[10px] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-[0.3em] group"
      >
        <span className="relative z-10">{state.isConnecting ? 'SYNCING...' : 'Link Identity'}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-10"></div>
      </button>

      {showConnectors && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass w-full max-w-sm p-10 rounded-[3.5rem] border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] space-y-8 relative">
            {/* Background decoration */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>
            
            <div className="text-center space-y-3 relative">
              <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-4 border border-white/5">
                🔗
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Neural Connect</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Choose your connection substrate</p>
            </div>
            
            <div className="grid gap-3 relative">
              {connectors.map((connector) => {
                const isUnavailableInjected = connector.id === 'injected' && !hasInjected;
                
                return (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    disabled={isUnavailableInjected}
                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 text-left transition-all group flex items-center justify-between disabled:opacity-30 disabled:grayscale"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        {connector.id === 'injected' ? '🦊' : '📱'}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-white">{connector.name}</p>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                          {isUnavailableInjected ? 'Extension Not Found' : 'Neural Link Standard'}
                        </p>
                      </div>
                    </div>
                    <span className="text-slate-700 group-hover:text-amber-500 transition-colors">→</span>
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => setShowConnectors(false)}
              className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
            >
              Abort Connection
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletConnectButton;
