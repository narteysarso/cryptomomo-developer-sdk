import React, { ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { CryptoMomoConfig } from '../types';
interface CryptoMomoProviderProps {
    config: CryptoMomoConfig;
    children: ReactNode;
    queryClient?: QueryClient;
}
interface CryptoMomoContextType {
    config: CryptoMomoConfig;
}
export declare const useCryptoMomoContext: () => CryptoMomoContextType;
export declare const CryptoMomoProvider: React.FC<CryptoMomoProviderProps>;
export {};
//# sourceMappingURL=CryptoMomoProvider.d.ts.map