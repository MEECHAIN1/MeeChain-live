
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppState';
import { config } from './lib/wagmi';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import GalleryPage from './pages/GalleryPage';
import StakingPage from './pages/StakingPage';
import SwapPage from './pages/SwapPage';
import MintPage from './pages/MintPage';
import SummonPage from './pages/SummonPage';
import EventLogPage from './pages/EventLogPage';
import TailwindTestPage from './pages/TailwindTestPage';
import OraclePage from './pages/OraclePage';
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay';
import RitualToasts from './components/RitualToasts';
import NetworkBanner from './components/NetworkBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Router>
            <div className="min-h-screen flex flex-col selection:bg-amber-500/30 relative pb-safe">
              <GlobalLoadingOverlay />
              <RitualToasts />
              <NetworkBanner />
              <Navbar />
              
              <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/mint" element={<MintPage />} />
                  <Route path="/summon" element={<SummonPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/staking" element={<StakingPage />} />
                  <Route path="/swap" element={<SwapPage />} />
                  <Route path="/oracle" element={<OraclePage />} />
                  <Route path="/logs" element={<EventLogPage />} />
                  <Route path="/debug" element={<TailwindTestPage />} />
                </Routes>
              </main>

              <footer className="px-6 py-12 border-t border-white/5 bg-black/40 mt-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-black font-black text-lg italic">M</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-[10px] tracking-tighter uppercase text-white">MEEBOT_PROTOCOL</span>
                      <span className="text-[8px] font-mono text-slate-500">VERSION_4.1.0_MOBILE_STABLE</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                    <a href="#" className="hover:text-amber-500 transition-colors">Nodes</a>
                    <a href="#" className="hover:text-amber-500 transition-colors">Security</a>
                    <a href="#" className="hover:text-amber-500 transition-colors">Ledger</a>
                  </div>
                  
                  <p className="text-[9px] text-slate-700 font-mono italic">
                    &copy; 2025 ALL_NEURAL_ASSETS_RESERVED
                  </p>
                </div>
              </footer>
            </div>
          </Router>
        </AppProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
