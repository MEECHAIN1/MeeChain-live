
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useApp } from '../context/AppState';
import { askOracle } from '../lib/ai';
import { triggerSuccessRitual, triggerCelestialRitual } from '../lib/rituals';

// Memoized Typewriter to prevent unnecessary re-renders
const TypewriterText = memo(({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 15);
    return () => clearInterval(timer);
  }, [text]); // Only restart if text actually changes

  return <span className="whitespace-pre-wrap leading-relaxed">{displayedText}</span>;
});

const OraclePage: React.FC = () => {
  const { state, notify, events, setGlobalLoading } = useApp();
  const [messages, setMessages] = useState<{role: 'user' | 'oracle', text: string, finished?: boolean}[]>([
    { role: 'oracle', text: 'ยินดีต้อนรับสู่ Oracle Sanctum... ข้าคือผู้เฝ้ามอง Eternal Ledger แห่ง MeeChain เจ้ามีความประสงค์จะรับคำทำนายหรือปัญญาในเรื่องใด?', finished: false }
  ]);
  const [input, setInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isTyping = state.loadingStates.oracle;

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend, finished: true }]);
    setGlobalLoading('oracle', true);
    triggerCelestialRitual();

    const telemetry = {
      balances: state.balances,
      account: state.account,
      recentEvents: events.slice(0, 5),
      timestamp: new Date().toISOString(),
      network: 'MeeChain Ritual (BSC)'
    };

    try {
      const response = await askOracle(textToSend, telemetry);
      setMessages(prev => [...prev, { role: 'oracle', text: response, finished: false }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'oracle', text: "สายใย Neural Link ขัดข้อง... โปรดลองอีกครั้ง", finished: true }]);
    } finally {
      setGlobalLoading('oracle', false);
    }
  };

  const markAsFinished = useCallback((index: number) => {
    setMessages(prev => {
      if (prev[index] && !prev[index].finished) {
        const newMsgs = [...prev];
        newMsgs[index] = { ...newMsgs[index], finished: true };
        return newMsgs;
      }
      return prev;
    });
    triggerSuccessRitual();
  }, []);

  return (
    <div className="max-w-6xl mx-auto h-[82vh] flex flex-col space-y-4 animate-in fade-in duration-1000">
      <header className="flex items-center justify-between px-6 py-2">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">
            Oracle <span className="text-amber-500">Sanctum</span>
          </h1>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Machine Spirit Core V3.5-PRO</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2 rounded-2xl">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">Neural Sync Optimized</span>
        </div>
      </header>

      <div className="flex-grow glass rounded-[3rem] border-white/5 overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        <div className="absolute top-10 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px] animate-pulse"></div>

        <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col p-8 bg-black/40 relative z-10">
          <div className="flex-grow space-y-8">
            <div className="relative group flex justify-center py-4">
              <div className="w-24 h-24 meebot-gradient rounded-3xl rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-transform duration-700">
                <span className="text-5xl -rotate-45">🔮</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">User Telemetry</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px]">
                    <span className="text-slate-400 font-bold uppercase">Gas Flux (BNB)</span>
                    <span className="text-white font-mono">{parseFloat(state.balances.native).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-[9px]">
                    <span className="text-slate-400 font-bold uppercase">MCB Energy</span>
                    <span className="text-amber-500 font-mono">{parseFloat(state.balances.token).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-grow flex flex-col bg-black/20">
          <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6 md:p-10 space-y-12 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`max-w-[90%] md:max-w-[75%] p-6 md:p-8 rounded-[2rem] relative shadow-xl ${
                  msg.role === 'user' 
                    ? 'bg-amber-600/90 text-white rounded-tr-none border border-amber-400/20' 
                    : 'glass border-white/10 text-slate-100 rounded-tl-none bg-white/[0.04]'
                }`}>
                  <div className="text-sm md:text-base font-medium tracking-tight">
                    {msg.role === 'oracle' && !msg.finished ? (
                      <TypewriterText text={msg.text} onComplete={() => markAsFinished(i)} />
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass border-white/10 p-5 rounded-3xl rounded-tl-none flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-black/30">
            <div className="flex gap-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={state.account ? "ระบุความประสงค์ต่อ Oracle..." : "กรุณาเชื่อมต่อ Neural Link..."}
                disabled={isTyping || !state.account}
                className="flex-grow bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-amber-500/30 transition-all text-white disabled:opacity-20"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim() || !state.account}
                className="bg-amber-600 hover:bg-amber-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl disabled:opacity-10 transition-all active:scale-95"
              >
                {isTyping ? 'LINKING...' : 'TRANSMIT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OraclePage;
