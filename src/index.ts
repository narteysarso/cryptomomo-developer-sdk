// Core exports
export * from './core';
export * from './types';

// React exports
export * from './react';
export * from './hooks';
export * from './components';

// Utilities
export * from './utils';

// Constants
export * from './constants';

// Main SDK class
import { CryptoMomoClient } from './core/client';
import { CryptoMomoConfig } from './types';

/**
 * CryptoMomo SDK - Main SDK class for easy initialization
 */
export class CryptoMomo {
  private static instance: CryptoMomoClient | null = null;
  private static config: CryptoMomoConfig | null = null;

  /**
   * Initialize the CryptoMomo SDK
   */
  static init(config: CryptoMomoConfig): CryptoMomoClient {
    CryptoMomo.config = config;
    CryptoMomo.instance = new CryptoMomoClient(config);
    return CryptoMomo.instance;
  }

  /**
   * Get the current SDK instance
   */
  static getInstance(): CryptoMomoClient {
    if (!CryptoMomo.instance) {
      throw new Error('CryptoMomo SDK not initialized. Call CryptoMomo.init() first.');
    }
    return CryptoMomo.instance;
  }

  /**
   * Get the current configuration
   */
  static getConfig(): CryptoMomoConfig {
    if (!CryptoMomo.config) {
      throw new Error('CryptoMomo SDK not initialized. Call CryptoMomo.init() first.');
    }
    return CryptoMomo.config;
  }

  /**
   * Check if SDK is initialized
   */
  static isInitialized(): boolean {
    return CryptoMomo.instance !== null;
  }

  /**
   * Reset the SDK instance
   */
  static reset(): void {
    CryptoMomo.instance = null;
    CryptoMomo.config = null;
  }
} 