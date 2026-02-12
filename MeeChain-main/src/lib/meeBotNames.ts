
/**
 * MeeBot Name Generation Utility
 * Provides randomized, high-fantasy tech names for mechanical assets.
 */

const prefixes = [
  "Alpha", "Zeta", "Nova", "Orion", "Titan", 
  "Celestial", "Astra", "Nebula", "Lotus", "Dragon",
  "Quantum", "Mecha", "Solar", "Void", "Eternal",
  "Spectral", "Neon", "Cyber", "Aether", "Giga"
];

const suffixes = [
  "Core", "Prime", "Flux", "Pulse", "Sentinel", 
  "Phantom", "Legend", "Spirit", "Soul", "Monk",
  "Guardian", "Prophet", "Vanguard", "Catalyst", "Engine",
  "Protocol", "Unit", "Dread", "Sovereign", "Shadow"
];

/**
 * Generates a mystical name for a MeeBot.
 * @param id - The unique identifier (usually tokenId) to append to the name.
 * @returns A formatted string e.g., "Lotus-Spirit-1024"
 */
export const generateMeeBotName = (id: string): string => {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}-${suffix}-${id}`;
};
