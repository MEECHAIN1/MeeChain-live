
import React, { useEffect, useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';
import { useApp } from '../context/AppState';
import { meechain, client } from '../lib/viemClient';

const NetworkBanner: React.FC = () => {
  const { isConnected, chainId } = useAccount();
  const { switchChain, status } = useSwitchChain();
  const { notify } = useApp();
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const isPending = status === 'pending';
  const isWrongNetwork = isConnected && chainId !== meechain.id;

  useEffect(() => {
    let interval: any;
    const fetchBlock = async () => {
      try {
        const block = await client.getBlockNumber();
        setBlockNumber(block);
      } catch (e: any) {
        // Silently ignore "Record deleted" or "Missing" errors common on BSC reorgs/heavy load
        if (!e?.message?.includes('deleted') && !e?.message?.includes('Missing')) {
          console.debug("Block sync jitter:", e.message);
        }
        setBlockNumber(null);
      }
    };

    fetchBlock();
    interval = setInterval(fetchBlock, 15000); // Relaxed sync frequency
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsDismissed(false);
  }, [chainId, isConnected]);

  const handleSwitch = async () => {
    if (!switchChain) {
      notify('error', 'สถาปัตยกรรมกระเป๋าเงินของคุณไม่รองรับการสลับเครือข่ายอัตโนมัติ');
      return;
    }

    try {
      notify('info', 'กำลังเริ่มต้นกระบวนการสลับเครือข่าย...');
      await switchChain({ chainId: meechain.id });
    } catch (err: any) {
      if (err?.code === 4001 || err?.name === 'UserRejectedRequestError') {
        notify('info', 'การสลับเครือข่ายถูกปฏิเสธโดยผู้ใช้');
      } else if (err?.message?.includes('reset')) {
        notify('error', 'การเชื่อมต่อถูกรีเซ็ต โปรดลองใหม่อีกครั้ง');
      } else {
        notify('error', 'ไม่สามารถสลับเครือข่ายได้');
      }
    }
  };

  if (!isConnected || (isDismissed && !isWrongNetwork)) return null;
  
  if (isWrongNetwork && !isDismissed) {
    return (
      <div className="bg-amber-600 text-white relative z-50 shadow-2xl animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl animate-pulse">
              ⚠️
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.2em]">Neural Link Mismatch</span>
              <p className="text-[10px] opacity-90 font-medium leading-relaxed max-w-md">
                อุปกรณ์ของคุณเชื่อมต่อกับ Sector {chainId} แต่ MeeBot Protocol ทำงานบน BNB Smart Chain เท่านั้น
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleSwitch}
              disabled={isPending}
              className="flex-grow md:flex-none bg-white text-amber-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              {isPending ? 'ALIGNING...' : 'REALIGN TO BSC'}
            </button>
            <button 
              onClick={() => setIsDismissed(true)}
              className="w-12 h-12 flex items-center justify-center hover:bg-black/10 rounded-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/70 italic">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
          <span>Sector Locked: {meechain.name} (ChainID: 56)</span>
        </div>
        <div className="flex items-center gap-5">
          <span className="opacity-40">BNB-POWERED PROTOCOL</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkBanner;
