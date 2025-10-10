import { z } from 'zod';

// Chain Configuration
export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet?: boolean;
}

// Developer Types (aligned with dev2 API)
export const DeveloperInfoSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  isEmailVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DeveloperInfo = z.infer<typeof DeveloperInfoSchema>;

// Developer Registration
export interface DeveloperRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Developer Login
export interface DeveloperLoginRequest {
  email: string;
  password: string;
}

// DApp Types (aligned with dev2 API)
export const DappSchema = z.object({
  id: z.string().uuid(),
  developerId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  appToken: z.string(),
  appSecret: z.string().optional(), // Only on creation/regeneration
  webhookUrl: z.string().url().optional(),
  ipWhitelist: z.array(z.string()).optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type DappInfo = z.infer<typeof DappSchema>;

// DApp Creation
export interface DappCreateRequest {
  name: string;
  description: string;
  webhookUrl?: string;
  ipWhitelist?: string[];
}

// DApp Update
export interface DappUpdateRequest {
  name?: string;
  description?: string;
  webhookUrl?: string;
  ipWhitelist?: string[];
  isActive?: boolean;
}

// Connection Types (aligned with dev2 API)
export const ConnectionSchema = z.object({
  id: z.string().uuid(),
  dappId: z.string().uuid(),
  phoneNumber: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'expired']),
  otpAttempts: z.number().min(0).max(3),
  expiresAt: z.string().datetime(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  sessionToken: z.string().optional(), // JWT token for browser-based authentication (30 min)
  refreshToken: z.string().optional(), // JWT token for refreshing sessions (7 days)
});

export type ConnectionInfo = z.infer<typeof ConnectionSchema>;

// Connection Request
export interface ConnectionRequestInput {
  phoneNumber: string;
  metadata?: Record<string, any>;
}

// OTP Verification
export interface OTPVerificationInput {
  connectionId: string;
  otp: string;
}

// Transaction Types (aligned with dev2 API)
export interface TransactionRequest {
  connectionId: string;
  to: `0x${string}`;
  value?: string; // in wei as string
  data?: `0x${string}`;
  chainId?: number;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface GaslessTransactionRequest extends TransactionRequest {
  paymasterAddress: `0x${string}`;
  sponsorType?: 'full' | 'partial';
}

export interface TransactionResponse {
  id: string; // Transaction record ID
  confirmationCode: string; // 6-character code for USSD confirmation
  codeExpiresAt: Date; // When the confirmation code expires
  status: 'awaiting_confirmation' | 'confirmed' | 'executing' | 'completed' | 'failed' | 'expired';
  connectionId: string;
  to: string;
  value: string;
  data?: string;
  chainId: number;
  isGasless: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Populated after execution
  txHash?: string;
  from?: string;
  gasUsed?: string;
  effectiveGasPrice?: string;
  blockNumber?: number;
  blockHash?: string;
  executedAt?: Date;
}

export interface BalanceResponse {
  address: string;
  balance: string; // in wei as string
  decimals: number;
  symbol: string;
  chainId: number;
}

// Authentication Types (aligned with dev2 API)
export interface TokenPair {
  accessToken: string; // Expires in 15 minutes
  refreshToken: string; // Expires in 7 days
}

export interface AuthResponse {
  developer: DeveloperInfo;
  tokens: TokenPair;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// SDK Configuration (Simplified for DApp usage)
export interface CryptoMomoConfig {
  // DApp app token (required - get from developer dashboard)
  // This is public and safe to expose in frontend code
  appToken: string;

  // Optional configuration
  baseUrl?: string;
  environment?: 'development' | 'production';
  timeout?: number;
  retryAttempts?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp?: number;
  };
}

// Error Types
export class CryptoMomoError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = 'CryptoMomoError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends CryptoMomoError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends CryptoMomoError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends CryptoMomoError {
  constructor(message: string = 'Network request failed', details?: any) {
    super(message, 'NETWORK_ERROR', 500, details);
    this.name = 'NetworkError';
  }
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface DappAnalytics {
  totalConnections: number;
  activeUsers: number;
  totalTransactions: number;
  gaslessTransactions: number;
  totalGasSaved: bigint;
  period: {
    from: Date;
    to: Date;
  };
}

// Paymaster Types
export interface PaymasterConfig {
  address: `0x${string}`;
  sponsorType: 'full' | 'partial';
  gasLimit?: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export interface PaymasterResponse {
  paymasterAndData: `0x${string}`;
  preVerificationGas: bigint;
  verificationGasLimit: bigint;
  callGasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}

// React Hook Types (aligned with dev2 API)
export interface UseConnectOptions {
  onSuccess?: (response: ConnectionInfo) => void;
  onError?: (error: CryptoMomoError) => void;
}

export interface UseTransactionOptions {
  onSuccess?: (response: TransactionResponse) => void;
  onError?: (error: CryptoMomoError) => void;
  gasless?: boolean;
}

// Component Props Types
// Theme Configuration
export interface CryptoMomoTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    border?: string;
    ring?: string;
    destructive?: string;
  };
  borderRadius?: string;
  fontFamily?: string;
}

export interface ConnectButtonProps {
  onConnect?: (response: ConnectionInfo) => void;
  onError?: (error: CryptoMomoError) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  theme?: CryptoMomoTheme;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  showLogo?: boolean;
  modal?: boolean;
}

export interface TransactionButtonProps {
  transaction: TransactionRequest;
  onSuccess?: (response: TransactionResponse) => void;
  onError?: (error: CryptoMomoError) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  gasless?: boolean;
  theme?: CryptoMomoTheme;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
}

// Store Types (for Zustand - User connection state)
export interface CryptoMomoStore {
  config: CryptoMomoConfig | null;

  // User connection state
  currentConnection: ConnectionInfo | null;
  isConnected: boolean;
  phoneNumber: string | null;

  // Actions
  setConfig: (config: CryptoMomoConfig) => void;
  setConnection: (connection: ConnectionInfo) => void;
  clearConnection: () => void;
  reset: () => void;
}

// Export schemas for validation
export const schemas = {
  DeveloperInfoSchema,
  DappSchema,
  ConnectionSchema,
} as const; 