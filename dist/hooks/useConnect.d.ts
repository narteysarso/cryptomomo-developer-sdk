import { UseConnectOptions, CryptoMomoError } from '../types';
/**
 * Hook for connecting users to your DApp via phone number + OTP
 * Similar to useConnect from WalletConnect/ThirdWeb
 */
export declare function useConnect(options?: UseConnectOptions): {
    connect: (phoneNum: string) => Promise<{
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
    verifyOTP: (otp: string) => Promise<{
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
    reset: () => void;
    isConnecting: boolean;
    isVerifying: boolean;
    isOTPSent: boolean;
    connectionId: string | null;
    phoneNumber: string;
    connectError: CryptoMomoError | null;
    verifyError: CryptoMomoError | null;
    isSuccess: boolean;
    isError: boolean;
};
//# sourceMappingURL=useConnect.d.ts.map