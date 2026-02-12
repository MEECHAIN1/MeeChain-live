import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { MeeBot, BlockchainEvent, mockBots, mockEvents, mockBalances, mockWalletAddress } from '../lib/mockData';

interface AppState {
  isConnected: boolean;
  account: string | null;
  balances: typeof mockBalances;
  myBots: MeeBot[];
  events: BlockchainEvent[];
  galleryFilter: string;
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  connect: () => void;
  disconnect: () => void;
  toggleBotStaking: (botId: string) => void;
  setGalleryFilter: (filter: string) => void;
  addBot: (bot: MeeBot) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isConnected: false,
    account: null,
    balances: mockBalances,
    myBots: mockBots,
    events: mockEvents,
    galleryFilter: 'All',
    isLoading: false
  });

  const connect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: true,
      account: mockWalletAddress
    }));
  }, []);

  const disconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      account: null
    }));
  }, []);

  const toggleBotStaking = useCallback((botId: string) => {
    setState(prev => ({
      ...prev,
      myBots: prev.myBots.map(bot => 
        bot.id === botId 
          ? { ...bot, isStaking: !bot.isStaking, energyLevel: bot.isStaking ? bot.energyLevel : bot.energyLevel + 5 }
          : bot
      )
    }));
  }, []);

  const setGalleryFilter = useCallback((filter: string) => {
    setState(prev => ({ ...prev, galleryFilter: filter }));
  }, []);

  const addBot = useCallback((bot: MeeBot) => {
    setState(prev => ({
      ...prev,
      myBots: [...prev.myBots, bot]
    }));
  }, []);

  return (
    <AppContext.Provider value={{ state, connect, disconnect, toggleBotStaking, setGalleryFilter, addBot }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
