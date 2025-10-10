import {
  CryptoMomoConfig,
  ApiResponse,
  ConnectionRequestInput,
  ConnectionInfo,
  OTPVerificationInput,
  TransactionRequest,
  GaslessTransactionRequest,
  TransactionResponse,
  BalanceResponse,
  CryptoMomoError,
  AuthenticationError,
  NetworkError,
  ValidationError,
} from '../types';
import { API_CONFIG, ENDPOINTS, ERROR_MESSAGES, AUTH_HEADERS } from '../constants';

/**
 * CryptoMomo Client - User connection SDK
 * For DApp integration to connect users via phone number + OTP
 *
 * Initialize with appToken only (safe for frontend)
 * After OTP verification, automatically switches to session token authentication
 */
export class CryptoMomoClient {
  private config: CryptoMomoConfig;
  private baseUrl: string;
  private sessionToken?: string;
  private refreshToken?: string;
  private refreshPromise?: Promise<void>; // Prevent concurrent refresh attempts

  constructor(config: CryptoMomoConfig) {
    this.config = config;
    this.baseUrl =
      config.baseUrl ||
      (config.environment === 'production' ? API_CONFIG.PRODUCTION_URL : API_CONFIG.BASE_URL);

    // Validate app token is provided
    if (!config.appToken) {
      throw new ValidationError(
        'App token required: provide appToken from your CryptoMomo dashboard.'
      );
    }
  }

  /**
   * Refresh session token using refresh token
   */
  private async refreshSessionToken(): Promise<void> {
    // Prevent concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.refreshToken) {
      throw new AuthenticationError('No refresh token available');
    }

    this.refreshPromise = (async () => {
      try {
        const url = `${this.baseUrl}${ENDPOINTS.CONNECTIONS.REFRESH}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (!response.ok) {
          throw new AuthenticationError('Failed to refresh session');
        }

        const data = await response.json();

        if (data.success && data.data) {
          this.sessionToken = data.data.sessionToken;
          this.refreshToken = data.data.refreshToken; // Token rotation
        } else {
          throw new AuthenticationError('Invalid refresh response');
        }
      } finally {
        this.refreshPromise = undefined;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Make authenticated API request with app token or session token
   * Automatically refreshes session if expired
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOnAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Use session token if available (after OTP verification), otherwise use app token
    if (this.sessionToken) {
      headers['Authorization'] = `Bearer ${this.sessionToken}`;
    } else {
      headers[AUTH_HEADERS.APP_TOKEN] = this.config.appToken;
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.config.timeout || API_CONFIG.TIMEOUT),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // If session expired and we have a refresh token, try to refresh
      if (
        error instanceof AuthenticationError &&
        error.message.includes('expired') &&
        this.refreshToken &&
        retryOnAuth
      ) {
        await this.refreshSessionToken();
        // Retry the request with new session token (don't retry again)
        return this.makeRequest<T>(endpoint, options, false);
      }

      if (error instanceof CryptoMomoError) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR;
      throw new NetworkError(ERROR_MESSAGES.NETWORK_ERROR, { error: errorMessage });
    }
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));

    const errorMessage = errorData.error?.message || errorData.message || ERROR_MESSAGES.NETWORK_ERROR;
    const errorCode = errorData.error?.code || 'UNKNOWN_ERROR';

    switch (response.status) {
      case 401:
        throw new AuthenticationError(errorMessage, errorData);
      case 400:
        throw new ValidationError(errorMessage, errorData);
      case 403:
        // IP not whitelisted
        throw new AuthenticationError(ERROR_MESSAGES.IP_NOT_WHITELISTED, errorData);
      case 429:
        throw new CryptoMomoError(errorMessage, 'RATE_LIMITED', response.status, errorData);
      default:
        throw new CryptoMomoError(errorMessage, errorCode, response.status, errorData);
    }
  }

  // ==================== Connection Flow APIs ====================

  /**
   * Request a new connection (checks wallet existence and sends OTP)
   * @param phoneNumber - User's phone number in E.164 format (e.g., +233123456789)
   * @param metadata - Optional metadata to store with the connection
   * @returns Connection info with connectionId and OTP for USSD confirmation
   * @throws CryptoMomoError with code 'USER_NOT_FOUND' if wallet doesn't exist
   */
  async requestConnection(
    phoneNumber: string,
    metadata?: Record<string, any>
  ): Promise<ConnectionInfo> {
    const request: ConnectionRequestInput = {
      phoneNumber,
      metadata,
    };

    const response = await this.makeRequest<ConnectionInfo>(
      ENDPOINTS.CONNECTIONS.REQUEST,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'CONNECTION_REQUEST_ERROR');
    }

    return response.data;
  }

  /**
   * Register a new wallet account
   * @param firstName - User's first name
   * @param lastName - User's last name
   * @param phoneNumber - User's phone number in E.164 format (e.g., +233123456789)
   * @returns Success message
   */
  async registerAccount(
    firstName: string,
    lastName: string,
    phoneNumber: string
  ): Promise<{ message: string }> {
    const request = {
      firstName,
      lastName,
      phoneNumber,
    };

    const response = await this.makeRequest<{ message: string }>(
      ENDPOINTS.CONNECTIONS.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'REGISTRATION_ERROR');
    }

    return response.data;
  }

  /**
   * Verify OTP and complete connection
   * Automatically switches to session token authentication after successful verification
   * @param connectionId - Connection ID from requestConnection
   * @param otp - 6-digit OTP code sent to user's phone
   * @returns Connection info with approved status and session token
   */
  async verifyOTP(connectionId: string, otp: string): Promise<ConnectionInfo> {
    const request: OTPVerificationInput = {
      connectionId,
      otp,
    };

    const response = await this.makeRequest<ConnectionInfo>(
      ENDPOINTS.CONNECTIONS.VERIFY,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.INVALID_OTP, 'OTP_VERIFICATION_ERROR');
    }

    // Automatically switch to session token authentication
    if (response.data.sessionToken) {
      this.sessionToken = response.data.sessionToken;
    }

    // Store refresh token for automatic session renewal
    if (response.data.refreshToken) {
      this.refreshToken = response.data.refreshToken;
    }

    return response.data;
  }

  /**
   * Get connection status by ID
   * @param connectionId - Connection ID
   * @returns Connection info
   */
  async getConnectionById(connectionId: string): Promise<ConnectionInfo> {
    const endpoint = ENDPOINTS.CONNECTIONS.GET_BY_ID.replace(':connectionId', connectionId);
    const response = await this.makeRequest<ConnectionInfo>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new CryptoMomoError(
        response.error || ERROR_MESSAGES.CONNECTION_NOT_FOUND,
        'GET_CONNECTION_ERROR'
      );
    }

    return response.data;
  }

  /**
   * Check if a user is connected to your DApp
   * @param phoneNumber - User's phone number
   * @returns Connection status and connection info if connected
   */
  async checkConnectionStatus(phoneNumber: string): Promise<{
    isConnected: boolean;
    connection?: ConnectionInfo;
  }> {
    const endpoint = `${ENDPOINTS.CONNECTIONS.CHECK_STATUS}?phoneNumber=${encodeURIComponent(phoneNumber)}`;
    const response = await this.makeRequest<{
      isConnected: boolean;
      connection?: ConnectionInfo;
    }>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'CHECK_CONNECTION_ERROR');
    }

    return response.data;
  }

  // ==================== Transaction APIs ====================

  /**
   * Send a regular transaction (user pays gas)
   */
  async sendTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    const response = await this.makeRequest<TransactionResponse>(
      ENDPOINTS.TRANSACTIONS.SEND,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'TRANSACTION_ERROR');
    }

    return response.data;
  }

  /**
   * Send a gasless transaction (sponsored by paymaster)
   */
  async sendGaslessTransaction(request: GaslessTransactionRequest): Promise<TransactionResponse> {
    const response = await this.makeRequest<TransactionResponse>(
      ENDPOINTS.TRANSACTIONS.GASLESS,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'GASLESS_TRANSACTION_ERROR');
    }

    return response.data;
  }

  /**
   * Confirm transaction with code (USSD confirmation)
   */
  async confirmTransaction(transactionId: string, confirmationCode: string): Promise<TransactionResponse> {
    const response = await this.makeRequest<TransactionResponse>(
      ENDPOINTS.TRANSACTIONS.CONFIRM,
      {
        method: 'POST',
        body: JSON.stringify({ transactionId, confirmationCode }),
      }
    );

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.INVALID_OTP, 'CONFIRM_TRANSACTION_ERROR');
    }

    return response.data;
  }

  /**
   * Get transaction status by ID
   */
  async getTransactionStatus(transactionId: string): Promise<TransactionResponse> {
    const endpoint = ENDPOINTS.TRANSACTIONS.STATUS.replace(':transactionId', transactionId);
    const response = await this.makeRequest<TransactionResponse>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'GET_TRANSACTION_STATUS_ERROR');
    }

    return response.data;
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(filters?: {
    connectionId?: string;
    phoneNumber?: string;
    limit?: number;
    offset?: number;
    status?: 'pending' | 'confirmed' | 'failed';
  }): Promise<TransactionResponse[]> {
    let endpoint = ENDPOINTS.TRANSACTIONS.HISTORY;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.connectionId) params.append('connectionId', filters.connectionId);
      if (filters.phoneNumber) params.append('phoneNumber', filters.phoneNumber);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.status) params.append('status', filters.status);
      endpoint += `?${params.toString()}`;
    }

    const response = await this.makeRequest<TransactionResponse[]>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'GET_TRANSACTION_HISTORY_ERROR');
    }

    return response.data;
  }

  /**
   * Get balance for a connection
   */
  async getBalance(
    connectionId: string,
    tokenAddress?: string,
    chainId?: number
  ): Promise<BalanceResponse> {
    const params = new URLSearchParams({ connectionId });
    if (tokenAddress) params.append('tokenAddress', tokenAddress);
    if (chainId) params.append('chainId', chainId.toString());

    const endpoint = `${ENDPOINTS.TRANSACTIONS.BALANCE}?${params.toString()}`;
    const response = await this.makeRequest<BalanceResponse>(endpoint, {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      throw new CryptoMomoError(response.error || ERROR_MESSAGES.NETWORK_ERROR, 'GET_BALANCE_ERROR');
    }

    return response.data;
  }

  // ==================== Configuration ====================

  /**
   * Update SDK configuration
   */
  updateConfig(newConfig: Partial<CryptoMomoConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.baseUrl) {
      this.baseUrl = newConfig.baseUrl;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): CryptoMomoConfig {
    return { ...this.config };
  }

  /**
   * Get session token (if available)
   */
  getSessionToken(): string | undefined {
    return this.sessionToken;
  }

  /**
   * Set session token manually (usually not needed, auto-set after verifyOTP)
   */
  setSessionToken(sessionToken: string): void {
    this.sessionToken = sessionToken;
  }

  /**
   * Get refresh token (if available)
   */
  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }

  /**
   * Set refresh token manually (usually not needed, auto-set after verifyOTP)
   */
  setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  /**
   * Set both session and refresh tokens (for restoring from storage)
   */
  setTokens(sessionToken: string, refreshToken: string): void {
    this.sessionToken = sessionToken;
    this.refreshToken = refreshToken;
  }

  /**
   * Clear session token (logout)
   */
  clearSessionToken(): void {
    this.sessionToken = undefined;
    this.refreshToken = undefined;
  }

  /**
   * Check if currently using session token authentication
   */
  isUsingSessionToken(): boolean {
    return !!this.sessionToken;
  }

  /**
   * Manually refresh the session token
   * Usually not needed - refresh happens automatically when session expires
   */
  async refreshSession(): Promise<void> {
    return this.refreshSessionToken();
  }
}
