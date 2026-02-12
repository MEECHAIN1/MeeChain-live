
import { client } from "../viemClient";
import { ABIS, ADRS } from "../contracts";
import { parseEther, formatEther } from "viem";

export async function getSwapQuote(amountIn: string, path: `0x${string}`[]): Promise<string> {
  try {
    if (!amountIn || isNaN(Number(amountIn)) || Number(amountIn) <= 0) return "0";
    
    const amounts = await client.readContract({
      address: ADRS.swap,
      abi: ABIS.swap,
      functionName: "getAmountsOut",
      args: [parseEther(amountIn), path],
    } as any);
    
    return formatEther(amounts[amounts.length - 1]);
  } catch (error) {
    console.warn("Quote fetch failed. Using mock 1:1 rate.");
    return amountIn; // Mock fallback
  }
}

export async function checkAllowance(owner: `0x${string}`, tokenAddress: `0x${string}`, spender: `0x${string}`): Promise<bigint> {
  try {
    const allowance = await client.readContract({
      address: tokenAddress,
      abi: ABIS.token,
      functionName: "allowance",
      args: [owner, spender],
    } as any);
    return BigInt(allowance);
  } catch (e) {
    return 0n;
  }
}

export async function performSwap(amountIn: string, minAmountOut: string, path: `0x${string}`[], to: `0x${string}`): Promise<string> {
  // In a real environment, we'd use useWriteContract from wagmi in the component.
  // For this dashboard ritual, we simulate the energy conversion transaction.
  await new Promise(resolve => setTimeout(resolve, 2500));
  return `0x${Math.random().toString(16).slice(2, 66)}`;
}
