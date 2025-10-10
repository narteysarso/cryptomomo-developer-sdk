/**
 * Format Ethereum address for display
 */
export declare function formatAddress(address: string, startLength?: number, endLength?: number): string;
/**
 * Format token amount for display
 */
export declare function formatTokenAmount(amount: string | number | bigint, decimals?: number, displayDecimals?: number): string;
/**
 * Parse token amount from string to bigint
 */
export declare function parseTokenAmount(amount: string, decimals?: number): bigint;
/**
 * Validate transaction hash format
 */
export declare function isValidTransactionHash(hash: string): boolean;
/**
 * Format transaction hash for display
 */
export declare function formatTxHash(hash: string, startLength?: number, endLength?: number): string;
/**
 * Format phone number for display
 */
export declare function formatPhoneNumber(phone: string, countryCode?: string): string;
/**
 * Format time duration
 */
export declare function formatDuration(seconds: number): string;
/**
 * Format timestamp to readable date
 */
export declare function formatDate(timestamp: number | Date, options?: Intl.DateTimeFormatOptions): string;
/**
 * Format relative time (e.g., "2 minutes ago")
 */
export declare function formatRelativeTime(timestamp: number | Date): string;
/**
 * Validate Ethereum address
 */
export declare function isValidAddress(address: string): boolean;
/**
 * Validate phone number (basic validation)
 */
export declare function isValidPhoneNumber(phone: string): boolean;
/**
 * Generate random ID
 */
export declare function generateId(): string;
/**
 * Copy text to clipboard
 */
export declare function copyToClipboard(text: string): Promise<boolean>;
/**
 * Debounce function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Validate OTP format
 */
export declare function isValidOTP(otp: string): boolean;
/**
 * Validate wallet address format
 */
export declare function isValidWalletAddress(address: string): boolean;
/**
 * Format balance amount with proper decimals
 */
export declare function formatBalance(balance: string | number, decimals?: number, displayDecimals?: number): string;
/**
 * Format currency amount with symbol
 */
export declare function formatCurrency(amount: string | number, symbol?: string, decimals?: number): string;
/**
 * Parse and format OTP input (ensure only digits)
 */
export declare function formatOTPInput(input: string): string;
/**
 * Check if OTP is complete
 */
export declare function isOTPComplete(otp: string): boolean;
/**
 * Format time remaining for OTP expiry
 */
export declare function formatTimeRemaining(expiryTime: Date): string;
//# sourceMappingURL=format.d.ts.map