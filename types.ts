
export interface NetworkInfo {
  id: number;
  name: string;
  rpcUrl: string;
}

export interface RitualNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'prophecy';
  message: string;
  timestamp: number;
}

export interface MeeBot {
  id: string;
  name: string;
  rarity: "Common" | "Epic" | "Legendary";
  energyLevel: number; 
  stakingStart: number | null; 
  isStaking: boolean;
  image: string;
  baseStats: {
    power: number;
    speed: number;
    intel: number;
  };
  components: string[];
}

export interface UserState {
  account: `0x${string}` | null;
  chainId: number | null;
  isConnecting: boolean;
  notifications: RitualNotification[];
  galleryFilter: string;
  loadingStates: {
    balances: boolean;
    staking: boolean;
    claiming: boolean;
    gallery: boolean;
    oracle: boolean;
    general: boolean;
  };
  balances: {
    native: string; // BNB
    token: string;  // MCB (Wallet)
    staked: string; // MCB (Staked)
    nftCount: number;
    rewardRate: string;
    gems: number;   // Summoning currency
    luckiness: number; // Gacha pity
  };
  myBots: MeeBot[]; 
}

export interface BlockchainEvent {
  id: string;
  type: 'Transfer' | 'Approval' | 'Staked' | 'Claimed' | 'Minted' | 'Infused' | 'Ascended';
  contract: 'NFT' | 'Token' | 'Staking' | 'NeuralCore';
  from: string;
  to?: string;
  amount?: string;
  tokenId?: string;
  timestamp: number;
  hash: string;
}

export interface NFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  owner: string;
}
