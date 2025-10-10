export * from './core';
export * from './types';
export * from './react';
export * from './hooks';
export * from './components';
export * from './utils';
export * from './constants';
import { CryptoMomoClient } from './core/client';
import { CryptoMomoConfig } from './types';
/**
 * CryptoMomo SDK - Main SDK class for easy initialization
 */
export declare class CryptoMomo {
    private static instance;
    private static config;
    /**
     * Initialize the CryptoMomo SDK
     */
    static init(config: CryptoMomoConfig): CryptoMomoClient;
    /**
     * Get the current SDK instance
     */
    static getInstance(): CryptoMomoClient;
    /**
     * Get the current configuration
     */
    static getConfig(): CryptoMomoConfig;
    /**
     * Check if SDK is initialized
     */
    static isInitialized(): boolean;
    /**
     * Reset the SDK instance
     */
    static reset(): void;
}
//# sourceMappingURL=index.d.ts.map