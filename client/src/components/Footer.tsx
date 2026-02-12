import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="px-6 py-12 border-t border-white/5 bg-black/40 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-black font-black text-lg italic">M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[10px] tracking-tighter uppercase text-white">MEEBOT_PROTOCOL</span>
            <span className="text-[8px] font-mono text-slate-500">VERSION_4.1.0_STABLE</span>
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
  );
};

export default Footer;
