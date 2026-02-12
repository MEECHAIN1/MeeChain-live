
import React from 'react';

const TailwindTestPage: React.FC = () => {
  return (
    <div className="p-10 space-y-12 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-indigo-500 uppercase tracking-tighter italic">
          Utility <span className="text-white">Validation Ritual</span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">Verifying tailwind energy flux within the MeeBot chassis.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-[2rem] space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Colors & Gradients</h3>
          <div className="flex flex-wrap gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20"></div>
            <div className="w-12 h-12 rounded-xl bg-amber-500 shadow-lg shadow-amber-500/20"></div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
            <div className="w-12 h-12 rounded-xl bg-rose-500 shadow-lg shadow-rose-500/20"></div>
            <div className="w-12 h-12 rounded-xl meebot-gradient"></div>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Typography</h3>
          <p className="text-3xl font-black italic tracking-tighter">DISPLAY EXTRA</p>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">System diagnostics indicate optimal rendering of high-density semantic fonts across all sectors.</p>
        </div>

        <div className="glass p-8 rounded-[2rem] space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Layout & Flex</h3>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase">Sync Active</span>
          </div>
        </div>
      </section>

      <div className="glass p-12 rounded-[3rem] border-dashed border-white/10 text-center">
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] italic">Tailwind Validation Complete</p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="px-8 py-3 bg-indigo-500 text-white font-black text-xs rounded-2xl hover:scale-105 transition-transform uppercase tracking-widest">Primary Action</button>
          <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black text-xs rounded-2xl hover:bg-white/10 transition-colors uppercase tracking-widest">Secondary Flux</button>
        </div>
      </div>
    </div>
  );
};

export default TailwindTestPage;
