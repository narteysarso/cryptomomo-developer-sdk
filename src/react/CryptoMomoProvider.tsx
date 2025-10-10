import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CryptoMomoConfig } from '../types';
import { useSetConfig } from '../core/store';

interface CryptoMomoProviderProps {
  config: CryptoMomoConfig;
  children: ReactNode;
  queryClient?: QueryClient;
}

interface CryptoMomoContextType {
  config: CryptoMomoConfig;
}

const CryptoMomoContext = createContext<CryptoMomoContextType | null>(null);

export const useCryptoMomoContext = () => {
  const context = useContext(CryptoMomoContext);
  if (!context) {
    throw new Error('useCryptoMomoContext must be used within a CryptoMomoProvider');
  }
  return context;
};

export const CryptoMomoProvider: React.FC<CryptoMomoProviderProps> = ({
  config,
  children,
  queryClient,
}) => {
  const setConfig = useSetConfig();
  
  // Create default query client if none provided
  const defaultQueryClient = React.useMemo(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          retry: 3,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          retry: 1,
        },
      },
    }),
    []
  );
  
  const client = queryClient || defaultQueryClient;

  // Initialize SDK configuration
  useEffect(() => {
    setConfig(config);
  }, [config, setConfig]);

  const contextValue: CryptoMomoContextType = {
    config,
  };

  return (
    <QueryClientProvider client={client}>
      <CryptoMomoContext.Provider value={contextValue}>
        {children}
      </CryptoMomoContext.Provider>
    </QueryClientProvider>
  );
}; 