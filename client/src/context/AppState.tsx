
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserState, BlockchainEvent, RitualNotification, MeeBot } from '../types';
import { formatEther } from 'viem';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { client } from '../lib/viemClient';
import { getNFTBalance } from '../lib/services/nft';
import { getTokenBalance } from '../lib/services/token';
import { getRewardRate, getStakedBalance } from '../lib/services/staking';
import { generateMeeBotName } from '../lib/meeBotNames';

interface AppContextType {
  state: UserState;
  events: BlockchainEvent[];
  connectWallet: (connector?: any) => Promise<void>;
  disconnectWallet: () => void;
  refreshBalances: () => Promise<void>;
  addEvent: (event: Omit<BlockchainEvent, 'id' | 'timestamp'>) => void;
  setGlobalLoading: (key: keyof UserState['loadingStates'], isLoading: boolean) => void;
  setGalleryFilter: (filter: string) => void;
  notify: (type: RitualNotification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  toggleBotStaking: (botId: string) => void;
  addBot: (bot: MeeBot) => void;
  updateLuckiness: (amount: number) => void;
  spendGems: (amount: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BOTS_STORAGE_KEY = 'meebot_collective_data';
const GALLERY_FILTER_KEY = 'meebot_gallery_filter';
const LUCKINESS_KEY = 'meebot_luckiness_progress';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const [state, setState] = useState<UserState>(() => {
    const savedBots = localStorage.getItem(BOTS_STORAGE_KEY);
    const savedFilter = localStorage.getItem(GALLERY_FILTER_KEY) || 'All';
    const savedLuck = localStorage.getItem(LUCKINESS_KEY);
    return {
      account: null,
      chainId: null,
      isConnecting: false,
      notifications: [],
      galleryFilter: savedFilter,
      loadingStates: {
        balances: false,
        staking: false,
        claiming: false,
        gallery: false,
        oracle: false,
        general: false
      },
      balances: {
        native: '0',
        token: '0',
        staked: '0',
        nftCount: 0,
        rewardRate: '0',
        gems: 250, // Initial balance
        luckiness: savedLuck ? parseInt(savedLuck) : 5
      },
      myBots: savedBots ? JSON.parse(savedBots) : []
    };
  });

  const [events, setEvents] = useState<BlockchainEvent[]>([]);

  useEffect(() => {
    localStorage.setItem(BOTS_STORAGE_KEY, JSON.stringify(state.myBots));
  }, [state.myBots]);

  useEffect(() => {
    localStorage.setItem(GALLERY_FILTER_KEY, state.galleryFilter);
  }, [state.galleryFilter]);

  useEffect(() => {
    localStorage.setItem(LUCKINESS_KEY, state.balances.luckiness.toString());
  }, [state.balances.luckiness]);

  useEffect(() => {
    if (address) {
      setState(prev => ({ ...prev, account: address as `0x${string}` }));
      if (state.myBots.length === 0) {
        const initialBots: MeeBot[] = Array.from({ length: 3 }).map((_, i) => {
          const id = (3600 + i).toString();
          const rarity = i === 0 ? "Epic" : "Common";
          return {
            id,
            name: generateMeeBotName(id),
            rarity,
            energyLevel: 0,
            stakingStart: null,
            isStaking: false,
            image: `https://picsum.photos/seed/meebot_${id}/1024/1024`,
            baseStats: {
              power: 40 + Math.random() * 20,
              speed: 40 + Math.random() * 20,
              intel: 40 + Math.random() * 20
            },
            components: i === 0
              ? ["Crystalline Chassis", "Quantum Processor", "Aetheric Link", "Tactical Optics"]
              : ["Standard Chassis", "Neural Processor", "Basic Sensors"]
          };
        });
        setState(prev => ({ ...prev, myBots: initialBots }));
      }
    }
  }, [address]);

  const addBot = useCallback((bot: MeeBot) => {
    setState(prev => ({
      ...prev,
      myBots: [bot, ...prev.myBots],
      balances: {
        ...prev.balances,
        nftCount: prev.balances.nftCount + 1
      }
    }));
  }, []);

  const updateLuckiness = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        luckiness: (prev.balances.luckiness + amount) % 101
      }
    }));
  }, []);

  const spendGems = useCallback((amount: number) => {
    let success = false;
    setState(prev => {
      if (prev.balances.gems >= amount) {
        success = true;
        return {
          ...prev,
          balances: {
            ...prev.balances,
            gems: prev.balances.gems - amount
          }
        };
      }
      return prev;
    });
    return success;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const updatedBots = prev.myBots.map(bot => {
          if (bot.isStaking && bot.stakingStart) {
            const now = Date.now();
            const elapsed = (now - bot.stakingStart) / 1000;
            if (elapsed >= 10) {
              return { ...bot, energyLevel: bot.energyLevel + 1, stakingStart: now };
            }
          }
          return bot;
        });
        return { ...prev, myBots: updatedBots };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleBotStaking = useCallback((botId: string) => {
    setState(prev => {
      const botIndex = prev.myBots.findIndex(b => b.id === botId);
      if (botIndex === -1) return prev;

      const bot = prev.myBots[botIndex];
      const activating = !bot.isStaking;
      
      const newBots = [...prev.myBots];
      newBots[botIndex] = {
        ...bot,
        isStaking: activating,
        stakingStart: activating ? Date.now() : null
      };

      setTimeout(() => {
        addEvent({
          type: activating ? 'Staked' : 'Claimed',
          contract: 'Staking',
          from: prev.account || '0x0',
          tokenId: bot.id,
          hash: `0x${Math.random().toString(16).slice(2, 66)}`
        });
        notify(activating ? 'success' : 'info', `${activating ? 'Rig Active' : 'Rig Idle'} for ${bot.name}`);
      }, 0);

      return { ...prev, myBots: newBots };
    });
  }, []);

  const notify = useCallback((type: RitualNotification['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id, type, message, timestamp: Date.now() }]
    }));
    setTimeout(() => {
      setState(current => ({
        ...current,
        notifications: current.notifications.filter(n => n.id !== id)
      }));
    }, 5000);
  }, []);

  const addEvent = useCallback((event: Omit<BlockchainEvent, 'id' | 'timestamp'>) => {
    const newEvent: BlockchainEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  }, []);

  const setGlobalLoading = useCallback((key: keyof UserState['loadingStates'], isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      loadingStates: { ...prev.loadingStates, [key]: isLoading }
    }));
  }, []);

  const setGalleryFilter = useCallback((filter: string) => {
    setState(prev => ({ ...prev, galleryFilter: filter }));
  }, []);

  const refreshBalances = useCallback(async () => {
    if (!address) return;
    setGlobalLoading('balances', true);
    try {
      const results = await Promise.allSettled([
        client.getBalance({ address }),
        getTokenBalance(address),
        getStakedBalance(address),
        getNFTBalance(address),
        getRewardRate()
      ]);

      const [nativeRes, tokenRes, stakedRes, nftRes, rewardRes] = results;

      setState(prev => ({
        ...prev,
        balances: {
          ...prev.balances,
          native: nativeRes.status === 'fulfilled' ? formatEther(nativeRes.value) : prev.balances.native,
          token: tokenRes.status === 'fulfilled' ? formatEther(tokenRes.value) : prev.balances.token,
          staked: stakedRes.status === 'fulfilled' ? formatEther(stakedRes.value) : prev.balances.staked,
          nftCount: prev.myBots.length || (nftRes.status === 'fulfilled' ? Number(nftRes.value) : prev.balances.nftCount),
          rewardRate: rewardRes.status === 'fulfilled' ? formatEther(rewardRes.value) : prev.balances.rewardRate
        }
      }));
    } catch (e) {
      console.warn("Sync error:", e);
    } finally {
      setGlobalLoading('balances', false);
    }
  }, [address, setGlobalLoading, state.myBots.length]);

  const connectWallet = async (connector?: any) => {
    setState(prev => ({ ...prev, isConnecting: true }));
    try {
      const targetConnector = connector || connectors[0];
      await connectAsync({ connector: targetConnector });
    } catch (err: any) {
      notify('error', `Connection Failed: ${err.message}`);
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnectAsync();
      setState(prev => ({ ...prev, account: null }));
    } catch (err: any) {
      notify('error', 'Disconnection Failed');
    }
  };

  const removeNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      events,
      connectWallet,
      disconnectWallet,
      refreshBalances,
      addEvent,
      setGlobalLoading,
      setGalleryFilter,
      notify,
      removeNotification,
      toggleBotStaking,
      addBot,
      updateLuckiness,
      spendGems
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
