
import { ERC20Abi } from '../abi/ERC20';
import { MeeBotNFTAbi } from '../abi/MeeBotNFT';
import { MeeBotStakingAbi } from '../abi/MeeBotStaking';
import { SwapRouterAbi } from '../abi/SwapRouter';

// Updated with requested BNB Smart Chain MCB Address
const DEPLOYED_NFT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" as const;
const DEPLOYED_TOKEN = "0x8Da6Eb1cd5c0C8cf84bD522AB7c11747DB1128C9" as const; // New MCB Address
const DEPLOYED_STAKING = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as const;
const DEPLOYED_SWAP = "0xB7f8BC63BbcaD8723ad05c014f34A1B3a41E9b0b" as const;

export const ADRS = {
  nft: (process.env.VITE_NFT_ADDRESS as `0x${string}`) || DEPLOYED_NFT,
  token: (process.env.VITE_MCB_TOKEN_ADDRESS as `0x${string}`) || DEPLOYED_TOKEN,
  staking: (process.env.VITE_STAKING_ADDRESS as `0x${string}`) || DEPLOYED_STAKING,
  swap: (process.env.VITE_SWAP_ADDRESS as `0x${string}`) || DEPLOYED_SWAP,
};

export const ABIS = {
  nft: MeeBotNFTAbi,
  token: ERC20Abi,
  staking: MeeBotStakingAbi,
  swap: SwapRouterAbi,
};
