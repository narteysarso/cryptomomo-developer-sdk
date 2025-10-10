import { z } from 'zod';
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
export declare const DeveloperInfoSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    isEmailVerified: z.ZodBoolean;
    isActive: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}, {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}>;
export type DeveloperInfo = z.infer<typeof DeveloperInfoSchema>;
export interface DeveloperRegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface DeveloperLoginRequest {
    email: string;
    password: string;
}
export declare const DappSchema: z.ZodObject<{
    id: z.ZodString;
    developerId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    appToken: z.ZodString;
    appSecret: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
    ipWhitelist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    developerId: string;
    name: string;
    appToken: string;
    description?: string | undefined;
    appSecret?: string | undefined;
    webhookUrl?: string | undefined;
    ipWhitelist?: string[] | undefined;
}, {
    id: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    developerId: string;
    name: string;
    appToken: string;
    description?: string | undefined;
    appSecret?: string | undefined;
    webhookUrl?: string | undefined;
    ipWhitelist?: string[] | undefined;
}>;
export type DappInfo = z.infer<typeof DappSchema>;
export interface DappCreateRequest {
    name: string;
    description: string;
    webhookUrl?: string;
    ipWhitelist?: string[];
}
export interface DappUpdateRequest {
    name?: string;
    description?: string;
    webhookUrl?: string;
    ipWhitelist?: string[];
    isActive?: boolean;
}
export declare const ConnectionSchema: z.ZodObject<{
    id: z.ZodString;
    dappId: z.ZodString;
    phoneNumber: z.ZodString;
    status: z.ZodEnum<["pending", "approved", "rejected", "expired"]>;
    otpAttempts: z.ZodNumber;
    expiresAt: z.ZodString;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    sessionToken: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
}>;
export type ConnectionInfo = z.infer<typeof ConnectionSchema>;
export interface ConnectionRequestInput {
    phoneNumber: string;
    metadata?: Record<string, any>;
}
export interface OTPVerificationInput {
    connectionId: string;
    otp: string;
}
export interface TransactionRequest {
    connectionId: string;
    to: `0x${string}`;
    value?: string;
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
    id: string;
    confirmationCode: string;
    codeExpiresAt: Date;
    status: 'awaiting_confirmation' | 'confirmed' | 'executing' | 'completed' | 'failed' | 'expired';
    connectionId: string;
    to: string;
    value: string;
    data?: string;
    chainId: number;
    isGasless: boolean;
    createdAt: Date;
    updatedAt: Date;
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
    balance: string;
    decimals: number;
    symbol: string;
    chainId: number;
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
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
export interface CryptoMomoConfig {
    appToken: string;
    baseUrl?: string;
    environment?: 'development' | 'production';
    timeout?: number;
    retryAttempts?: number;
}
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
export declare class CryptoMomoError extends Error {
    code: string;
    statusCode: number;
    details?: any;
    constructor(message: string, code: string, statusCode?: number, details?: any);
}
export declare class ValidationError extends CryptoMomoError {
    constructor(message: string, details?: any);
}
export declare class AuthenticationError extends CryptoMomoError {
    constructor(message?: string, details?: any);
}
export declare class NetworkError extends CryptoMomoError {
    constructor(message?: string, details?: any);
}
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
export interface UseConnectOptions {
    onSuccess?: (response: ConnectionInfo) => void;
    onError?: (error: CryptoMomoError) => void;
}
export interface UseTransactionOptions {
    onSuccess?: (response: TransactionResponse) => void;
    onError?: (error: CryptoMomoError) => void;
    gasless?: boolean;
}
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
export interface CryptoMomoStore {
    config: CryptoMomoConfig | null;
    currentConnection: ConnectionInfo | null;
    isConnected: boolean;
    phoneNumber: string | null;
    setConfig: (config: CryptoMomoConfig) => void;
    setConnection: (connection: ConnectionInfo) => void;
    clearConnection: () => void;
    reset: () => void;
}
export declare const schemas: {
    readonly DeveloperInfoSchema: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        isEmailVerified: z.ZodBoolean;
        isActive: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isEmailVerified: boolean;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        isEmailVerified: boolean;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    readonly DappSchema: z.ZodObject<{
        id: z.ZodString;
        developerId: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        appToken: z.ZodString;
        appSecret: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
        ipWhitelist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        developerId: string;
        name: string;
        appToken: string;
        description?: string | undefined;
        appSecret?: string | undefined;
        webhookUrl?: string | undefined;
        ipWhitelist?: string[] | undefined;
    }, {
        id: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        developerId: string;
        name: string;
        appToken: string;
        description?: string | undefined;
        appSecret?: string | undefined;
        webhookUrl?: string | undefined;
        ipWhitelist?: string[] | undefined;
    }>;
    readonly ConnectionSchema: z.ZodObject<{
        id: z.ZodString;
        dappId: z.ZodString;
        phoneNumber: z.ZodString;
        status: z.ZodEnum<["pending", "approved", "rejected", "expired"]>;
        otpAttempts: z.ZodNumber;
        expiresAt: z.ZodString;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
        sessionToken: z.ZodOptional<z.ZodString>;
        refreshToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>;
};
//# sourceMappingURL=index.d.ts.map