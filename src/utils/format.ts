import { VALIDATION, DEFAULTS } from '../constants';

/**
 * Format Ethereum address for display
 */
export function formatAddress(address: string, startLength = 6, endLength = 4): string {
  if (!isValidWalletAddress(address)) {
    return address;
  }
  
  if (address.length <= startLength + endLength) {
    return address;
  }
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Format token amount for display
 */
export function formatTokenAmount(
  amount: string | number | bigint,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  try {
    const bigIntAmount = typeof amount === 'bigint' ? amount : BigInt(amount.toString());
    const divisor = BigInt(10 ** decimals);
    const quotient = bigIntAmount / divisor;
    const remainder = bigIntAmount % divisor;
    
    if (remainder === 0n) {
      return quotient.toString();
    }
    
    const remainderStr = remainder.toString().padStart(decimals, '0');
    const truncatedRemainder = remainderStr.slice(0, displayDecimals).replace(/0+$/, '');
    
    if (truncatedRemainder === '') {
      return quotient.toString();
    }
    
    return `${quotient}.${truncatedRemainder}`;
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
}

/**
 * Parse token amount from string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  try {
    const [whole, fraction = ''] = amount.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(whole + paddedFraction);
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return 0n;
  }
}

/**
 * Validate transaction hash format
 */
export function isValidTransactionHash(hash: string): boolean {
  return VALIDATION.TRANSACTION_HASH_REGEX.test(hash);
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string, startLength = 10, endLength = 8): string {
  if (!isValidTransactionHash(hash)) {
    return hash;
  }
  
  if (hash.length <= startLength + endLength) {
    return hash;
  }
  
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string, countryCode?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const code = countryCode || DEFAULTS.PHONE_COUNTRY_CODE;
  
  if (phone.startsWith('+')) {
    return phone;
  }
  
  if (phone.startsWith('0')) {
    return `${code}${cleanPhone.substring(1)}`;
  }
  
  return `${code}${cleanPhone}`;
}

/**
 * Format time duration
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days}d`;
  }
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhoneNumber(phone: string): boolean {
  return VALIDATION.PHONE_REGEX.test(phone);
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Validate OTP format
 */
export function isValidOTP(otp: string): boolean {
  return VALIDATION.OTP_REGEX.test(otp);
}

/**
 * Validate wallet address format
 */
export function isValidWalletAddress(address: string): boolean {
  return VALIDATION.WALLET_ADDRESS_REGEX.test(address);
}

/**
 * Format balance amount with proper decimals
 */
export function formatBalance(
  balance: string | number, 
  decimals: number = 18, 
  displayDecimals: number = 4
): string {
  const balanceNum = typeof balance === 'string' ? parseFloat(balance) : balance;
  const divisor = Math.pow(10, decimals);
  const formatted = (balanceNum / divisor).toFixed(displayDecimals);
  
  // Remove trailing zeros
  return parseFloat(formatted).toString();
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(
  amount: string | number,
  symbol: string = 'CEDI',
  decimals: number = 2
): string {
  const amountNum = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${amountNum.toFixed(decimals)} ${symbol}`;
}

/**
 * Parse and format OTP input (ensure only digits)
 */
export function formatOTPInput(input: string): string {
  return input.replace(/\D/g, '').slice(0, DEFAULTS.OTP_LENGTH);
}

/**
 * Check if OTP is complete
 */
export function isOTPComplete(otp: string): boolean {
  return otp.length === DEFAULTS.OTP_LENGTH && isValidOTP(otp);
}

/**
 * Format time remaining for OTP expiry
 */
export function formatTimeRemaining(expiryTime: Date): string {
  const now = new Date();
  const diff = expiryTime.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 