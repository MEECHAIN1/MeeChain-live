
import { Chain } from 'viem';

// MeeChain Configuration updated to use BNB Smart Chain (BSC) as the primary protocol
export const meechain: Chain = {
  id: 56, // Binance Smart Chain Mainnet
  name: 'MeeChain Ritual (BSC)',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org/', 'https://binance.llamarpc.com'] },
    public: { http: ['https://bsc-dataseed.binance.org/', 'https://binance.llamarpc.com'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
};
