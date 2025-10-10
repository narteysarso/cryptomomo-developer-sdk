import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CryptoMomoStore, CryptoMomoConfig, ConnectionInfo } from '../types';
import { STORAGE_KEYS } from '../constants';

export const useCryptoMomoStore = create<CryptoMomoStore>()(
  persist(
    (set, get) => ({
      // State
      config: null,
      currentConnection: null,
      isConnected: false,
      phoneNumber: null,

      // Actions
      setConfig: (config: CryptoMomoConfig) => {
        set({ config });
      },

      setConnection: (connection: ConnectionInfo) => {
        set({
          currentConnection: connection,
          phoneNumber: connection.phoneNumber,
          isConnected: connection.status === 'approved',
        });
      },

      clearConnection: () => {
        set({
          currentConnection: null,
          phoneNumber: null,
          isConnected: false,
        });
      },

      reset: () => {
        set({
          config: null,
          currentConnection: null,
          isConnected: false,
          phoneNumber: null,
        });
      },
    }),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      storage: createJSONStorage(() => {
        // Use localStorage in browser, fallback to memory storage
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }

        // Memory storage fallback for server-side rendering
        const storage = new Map();
        return {
          getItem: (key: string) => storage.get(key) || null,
          setItem: (key: string, value: string) => storage.set(key, value),
          removeItem: (key: string) => storage.delete(key),
        };
      }),
      partialize: (state) => ({
        config: state.config,
        currentConnection: state.currentConnection,
        isConnected: state.isConnected,
        phoneNumber: state.phoneNumber,
      }),
    }
  )
);

// Selectors for better performance
export const useConfig = () => useCryptoMomoStore((state) => state.config);
export const useIsConnected = () => useCryptoMomoStore((state) => state.isConnected);
export const useCurrentConnection = () => useCryptoMomoStore((state) => state.currentConnection);
export const usePhoneNumber = () => useCryptoMomoStore((state) => state.phoneNumber);

// Action selectors
export const useSetConfig = () => useCryptoMomoStore((state) => state.setConfig);
export const useSetConnection = () => useCryptoMomoStore((state) => state.setConnection);
export const useClearConnection = () => useCryptoMomoStore((state) => state.clearConnection);
export const useDisconnect = () => useCryptoMomoStore((state) => state.clearConnection); // Alias for better DX
export const useReset = () => useCryptoMomoStore((state) => state.reset);
