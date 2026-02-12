import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

/**
 * 🛠️ ยืนยัน Chain ID ให้เป็น 13390 เท่านั้น
 * เพื่อให้กระเป๋า (MetaMask/Web3Auth) มองเห็นเครือข่ายเดียวกัน
 */
export const ritualChain = defineChain({
  id: 13390, // บังคับเลขนี้
  name: 'MeeChain Ritual',
  nativeCurrency: { name: 'MeeCoin', symbol: 'MCB', decimals: 18 },
  rpcUrls: {
    default: { http: [''] },
    public: { http: ['https://ritual-chain--praphaprawanta.replit.app'] },
  },
});

export const config = createConfig({
  chains: [ritualChain],
  transports: {
    [ritualChain.id]: http(),
  },
});