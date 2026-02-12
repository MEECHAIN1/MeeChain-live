
import { client } from "../viemClient";
import { ABIS, ADRS } from "../contracts";

export async function getNFTBalance(account: `0x${string}`): Promise<bigint> {
  if (!account) return 0n;
  
  try {
    const result = await client.readContract({
      address: ADRS.nft,
      abi: ABIS.nft,
      functionName: "balanceOf",
      args: [account],
    });
    
    if (typeof result === 'bigint') return result;
    if (result !== undefined && result !== null) return BigInt(result as any);
    return 0n;
  } catch (error) {
    console.error("NFT balanceOf call failed:", error);
    // Silent fallback to avoid hanging the app, refreshBalances handles the UI
    return 0n;
  }
}

export async function getNFTOwner(tokenId: bigint): Promise<`0x${string}`> {
  try {
    const owner = await client.readContract({
      address: ADRS.nft,
      abi: ABIS.nft,
      functionName: "ownerOf",
      args: [tokenId],
    });
    return owner as `0x${string}`;
  } catch (error) {
    return "0x0000000000000000000000000000000000000000";
  }
}

export function watchNFTTransfers(onLog: (from: string, to: string, tokenId: bigint, hash: string) => void): () => void {
  try {
    const unwatch = client.watchContractEvent({
      address: ADRS.nft,
      abi: ABIS.nft,
      eventName: "Transfer",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const { from, to, tokenId } = log.args;
          if (from && to && tokenId !== undefined) {
            onLog(from, to, tokenId, log.transactionHash);
          }
        });
      },
    });
    return typeof unwatch === 'function' ? unwatch : () => {};
  } catch (e) {
    console.warn("Could not watch NFT events:", e);
    return () => {};
  }
}
