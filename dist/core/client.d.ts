import { CryptoMomoConfig, ConnectionInfo, TransactionRequest, GaslessTransactionRequest, TransactionResponse, BalanceResponse } from '../types';
/**
 * CryptoMomo Client - User connection SDK
 * For DApp integration to connect users via phone number + OTP
 *
 * Initialize with appToken only (safe for frontend)
 * After OTP verification, automatically switches to session token authentication
 */
export declare class CryptoMomoClient {
    private config;
    private baseUrl;
    private sessionToken?;
    private refreshToken?;
    private refreshPromise?;
    constructor(config: CryptoMomoConfig);
    /**
     * Refresh session token using refresh token
     */
    private refreshSessionToken;
    /**
     * Make authenticated API request with app token or session token
     * Automatically refreshes session if expired
     */
    private makeRequest;
    /**
     * Handle error responses
     */
    private handleErrorResponse;
    /**
     * Request a new connection (sends OTP to user's phone)
     * @param phoneNumber - User's phone number in E.164 format (e.g., +233123456789)
     * @param metadata - Optional metadata to store with the connection
     * @returns Connection info with connectionId for OTP verification
     */
    requestConnection(phoneNumber: string, metadata?: Record<string, any>): Promise<ConnectionInfo>;
    /**
     * Verify OTP and complete connection
     * Automatically switches to session token authentication after successful verification
     * @param connectionId - Connection ID from requestConnection
     * @param otp - 6-digit OTP code sent to user's phone
     * @returns Connection info with approved status and session token
     */
    verifyOTP(connectionId: string, otp: string): Promise<ConnectionInfo>;
    /**
     * Get connection status by ID
     * @param connectionId - Connection ID
     * @returns Connection info
     */
    getConnectionById(connectionId: string): Promise<ConnectionInfo>;
    /**
     * Check if a user is connected to your DApp
     * @param phoneNumber - User's phone number
     * @returns Connection status and connection info if connected
     */
    checkConnectionStatus(phoneNumber: string): Promise<{
        isConnected: boolean;
        connection?: ConnectionInfo;
    }>;
    /**
     * Send a regular transaction (user pays gas)
     */
    sendTransaction(request: TransactionRequest): Promise<TransactionResponse>;
    /**
     * Send a gasless transaction (sponsored by paymaster)
     */
    sendGaslessTransaction(request: GaslessTransactionRequest): Promise<TransactionResponse>;
    /**
     * Confirm transaction with code (USSD confirmation)
     */
    confirmTransaction(transactionId: string, confirmationCode: string): Promise<TransactionResponse>;
    /**
     * Get transaction status by ID
     */
    getTransactionStatus(transactionId: string): Promise<TransactionResponse>;
    /**
     * Get transaction history
     */
    getTransactionHistory(filters?: {
        connectionId?: string;
        phoneNumber?: string;
        limit?: number;
        offset?: number;
        status?: 'pending' | 'confirmed' | 'failed';
    }): Promise<TransactionResponse[]>;
    /**
     * Get balance for a connection
     */
    getBalance(connectionId: string, tokenAddress?: string, chainId?: number): Promise<BalanceResponse>;
    /**
     * Update SDK configuration
     */
    updateConfig(newConfig: Partial<CryptoMomoConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): CryptoMomoConfig;
    /**
     * Get session token (if available)
     */
    getSessionToken(): string | undefined;
    /**
     * Set session token manually (usually not needed, auto-set after verifyOTP)
     */
    setSessionToken(sessionToken: string): void;
    /**
     * Get refresh token (if available)
     */
    getRefreshToken(): string | undefined;
    /**
     * Set refresh token manually (usually not needed, auto-set after verifyOTP)
     */
    setRefreshToken(refreshToken: string): void;
    /**
     * Set both session and refresh tokens (for restoring from storage)
     */
    setTokens(sessionToken: string, refreshToken: string): void;
    /**
     * Clear session token (logout)
     */
    clearSessionToken(): void;
    /**
     * Check if currently using session token authentication
     */
    isUsingSessionToken(): boolean;
    /**
     * Manually refresh the session token
     * Usually not needed - refresh happens automatically when session expires
     */
    refreshSession(): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map