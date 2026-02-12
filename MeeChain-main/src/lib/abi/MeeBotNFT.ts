
export const MeeBotNFTAbi = [
  { "type": "function", "name": "balanceOf", "stateMutability": "view", "inputs": [{ "name": "owner", "type": "address" }], "outputs": [{ "type": "uint256" }] },
  { "type": "function", "name": "ownerOf", "stateMutability": "view", "inputs": [{ "name": "tokenId", "type": "uint256" }], "outputs": [{ "type": "address" }] },
  { "type": "function", "name": "tokenURI", "stateMutability": "view", "inputs": [{ "name": "tokenId", "type": "uint256" }], "outputs": [{ "type": "string" }] },
  { "type": "function", "name": "approve", "stateMutability": "nonpayable", "inputs": [{ "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }], "outputs": [] },
  { "type": "function", "name": "safeTransferFrom", "stateMutability": "nonpayable", "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }], "outputs": [] },
  { "type": "event", "name": "Transfer", "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": true, "name": "tokenId", "type": "uint256" }] }
] as const;
