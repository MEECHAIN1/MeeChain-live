export interface MeeBot {
  id: string;
  name: string;
  rarity: "Common" | "Epic" | "Legendary";
  energyLevel: number;
  isStaking: boolean;
  image: string;
  baseStats: {
    power: number;
    speed: number;
    intel: number;
  };
  components: string[];
}

export interface BlockchainEvent {
  id: string;
  type: 'Transfer' | 'Staked' | 'Claimed' | 'Minted';
  contract: 'NFT' | 'Token' | 'Staking';
  from: string;
  to?: string;
  amount?: string;
  tokenId?: string;
  timestamp: number;
  hash: string;
}

export const mockBots: MeeBot[] = [
  {
    id: "1001",
    name: "NEXUS_PRIME",
    rarity: "Legendary",
    energyLevel: 52,
    isStaking: true,
    image: "https://picsum.photos/seed/meebot1001/512/512",
    baseStats: { power: 78, speed: 65, intel: 82 },
    components: ["Crystalline Hull", "Fusion Core", "Singularity Drive", "Omni-Senses"]
  },
  {
    id: "1002",
    name: "VOID_WALKER",
    rarity: "Epic",
    energyLevel: 28,
    isStaking: true,
    image: "https://picsum.photos/seed/meebot1002/512/512",
    baseStats: { power: 62, speed: 74, intel: 58 },
    components: ["Refined Plate", "Overclocked Core", "Enhanced Senses"]
  },
  {
    id: "1003",
    name: "QUANTUM_SHADE",
    rarity: "Epic",
    energyLevel: 15,
    isStaking: false,
    image: "https://picsum.photos/seed/meebot1003/512/512",
    baseStats: { power: 55, speed: 68, intel: 71 },
    components: ["Refined Plate", "Neural Core", "Tactical Senses"]
  },
  {
    id: "1004",
    name: "IRON_SENTINEL",
    rarity: "Common",
    energyLevel: 5,
    isStaking: false,
    image: "https://picsum.photos/seed/meebot1004/512/512",
    baseStats: { power: 48, speed: 45, intel: 42 },
    components: ["Standard Plate", "Neural Core", "Basic Senses"]
  }
];

export const mockEvents: BlockchainEvent[] = [
  {
    id: "evt1",
    type: "Staked",
    contract: "Staking",
    from: "0x742d...3f8a",
    amount: "500 MCB",
    timestamp: Date.now() - 120000,
    hash: "0x8f3d...c4e2"
  },
  {
    id: "evt2",
    type: "Minted",
    contract: "NFT",
    from: "0x0000...0000",
    to: "0x742d...3f8a",
    tokenId: "1005",
    timestamp: Date.now() - 300000,
    hash: "0x2a1b...9f7e"
  }
];

export const mockBalances = {
  native: "2.4582",
  token: "12,450.00",
  staked: "8,200.00",
  nftCount: 6,
  gems: 45,
  luckiness: 35
};

export const mockWalletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f8a";

export const tokens = [
  { symbol: 'MCB', name: 'MeeChain Bot', icon: '💎' },
  { symbol: 'sMCB', name: 'Staked MeeBot', icon: '💰' },
  { symbol: 'BNB', name: 'BNB Flux', icon: '⚡' }
];
