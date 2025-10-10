import { CryptoMomoStore, CryptoMomoConfig, ConnectionInfo } from '../types';
export declare const useCryptoMomoStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CryptoMomoStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CryptoMomoStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CryptoMomoStore) => void) => () => void;
        onFinishHydration: (fn: (state: CryptoMomoStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CryptoMomoStore, unknown>>;
    };
}>;
export declare const useConfig: () => CryptoMomoConfig | null;
export declare const useIsConnected: () => boolean;
export declare const useCurrentConnection: () => {
    id: string;
    createdAt: string;
    updatedAt: string;
    status: "pending" | "approved" | "rejected" | "expired";
    dappId: string;
    phoneNumber: string;
    otpAttempts: number;
    expiresAt: string;
    metadata?: Record<string, any> | undefined;
    sessionToken?: string | undefined;
    refreshToken?: string | undefined;
} | null;
export declare const usePhoneNumber: () => string | null;
export declare const useSetConfig: () => (config: CryptoMomoConfig) => void;
export declare const useSetConnection: () => (connection: ConnectionInfo) => void;
export declare const useClearConnection: () => () => void;
export declare const useDisconnect: () => () => void;
export declare const useReset: () => () => void;
//# sourceMappingURL=store.d.ts.map