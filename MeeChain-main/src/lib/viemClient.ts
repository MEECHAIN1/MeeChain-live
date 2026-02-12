
import { createPublicClient, http } from 'viem';
import { meechain } from './constants/chains';

// Using standard http transport for maximum compatibility and stability
const PRIMARY_RPC = "https://bsc-dataseed.binance.org/";

export { meechain };

export const client = createPublicClient({
  chain: meechain,
  transport: http(PRIMARY_RPC, {
    timeout: 10000,
    retryCount: 2,
    retryDelay: 1000,
  }),
});
