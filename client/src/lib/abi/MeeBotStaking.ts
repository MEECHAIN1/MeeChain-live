
export const MeeBotStakingAbi = [
  { "type": "function", "name": "stake", "stateMutability": "nonpayable", "inputs": [{ "name": "amount", "type": "uint256" }], "outputs": [] },
  { "type": "function", "name": "withdraw", "stateMutability": "nonpayable", "inputs": [{ "name": "amount", "type": "uint256" }], "outputs": [] },
  { "type": "function", "name": "claimRewards", "stateMutability": "nonpayable", "inputs": [], "outputs": [] },
  { "type": "function", "name": "rewardRate", "stateMutability": "view", "inputs": [], "outputs": [{ "type": "uint256" }] },
  { "type": "function", "name": "stakedBalances", "stateMutability": "view", "inputs": [{ "name": "account", "type": "address" }], "outputs": [{ "type": "uint256" }] },
  { "type": "event", "name": "Staked", "inputs": [{ "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }] },
  { "type": "event", "name": "Claimed", "inputs": [{ "indexed": true, "name": "user", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }] }
] as const;
