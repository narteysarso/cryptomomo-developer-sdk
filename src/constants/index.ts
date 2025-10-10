/**
 * CryptoMomo SDK Constants
 * Centralized location for all API URLs, endpoints, and configuration values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api/v1',
  PRODUCTION_URL: 'https://api.cryptomomo.africa/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints (User-facing only - for DApp integration)
export const ENDPOINTS = {
  // Connection Flow (Phone number + OTP)
  CONNECTIONS: {
    REQUEST: '/connections/request',      // Request connection (send OTP)
    REGISTER: '/connections/register',    // Register new wallet account
    VERIFY: '/connections/verify',        // Verify OTP
    REFRESH: '/connections/refresh',      // Refresh session token
    GET_BY_ID: '/connections/:connectionId',  // Get connection status
    CHECK_STATUS: '/connections/check/status', // Check if user is connected
  },

  // Transactions
  TRANSACTIONS: {
    SEND: '/transactions/send',                    // Send regular transaction
    GASLESS: '/transactions/gasless',              // Send gasless transaction
    CONFIRM: '/transactions/confirm',              // Confirm transaction with code
    STATUS: '/transactions/:transactionId/status', // Get transaction status
    HISTORY: '/transactions/history',              // Get transaction history
    BALANCE: '/transactions/balance',              // Get user balance
  },
} as const;

// Error Messages (aligned with dev2 error codes)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'Authentication failed. Please check your credentials.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  INVALID_TOKEN: 'Invalid or expired token.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_OTP: 'Invalid or expired OTP.',
  INVALID_APP_CREDENTIALS: 'Invalid app token or app secret.',
  VALIDATION_ERROR: 'Invalid input data.',
  DUPLICATE_EMAIL: 'Email already exists.',
  DEVELOPER_NOT_FOUND: 'Developer not found.',
  DAPP_NOT_FOUND: 'DApp not found.',
  CONNECTION_NOT_FOUND: 'Connection not found.',
  IP_NOT_WHITELISTED: 'Your IP address is not whitelisted for this app.',
  PLATFORM_MANAGER_NOT_FOUND: 'Platform manager not found.',
  RATE_LIMITED: 'Too many requests. Please wait and try again.',
  USER_NOT_FOUND: 'Wallet account not found. Please register.',
  REGISTRATION_REQUIRED: 'Please complete registration to continue.',
} as const;

// Success Messages (User-facing)
export const SUCCESS_MESSAGES = {
  OTP_GENERATED: 'Connection code generated. Please confirm via USSD.',
  CONNECTION_VERIFIED: 'Connected successfully!',
  TRANSACTION_SENT: 'Transaction sent successfully!',
  TRANSACTION_CONFIRMED: 'Transaction confirmed!',
  GASLESS_TRANSACTION_SENT: 'Gasless transaction sent successfully!',
  ACCOUNT_REGISTERED: 'Account created successfully! Please claim your account via USSD.',
} as const;

// Storage Keys (User session data)
export const STORAGE_KEYS = {
  CONNECTION_ID: 'cryptomomo_connection_id',
  PHONE_NUMBER: 'cryptomomo_phone_number',
  CONNECTION_STATUS: 'cryptomomo_connection_status',
  USER_PREFERENCES: 'cryptomomo_user_preferences',
  THEME_SETTINGS: 'cryptomomo_theme_settings',
} as const;

// Default Values
export const DEFAULTS = {
  PHONE_COUNTRY_CODE: '+233', // Ghana default
  OTP_LENGTH: 6,
  OTP_EXPIRY: 300000, // 5 minutes in milliseconds
  TRANSACTION_TIMEOUT: 60000, // 1 minute
  CONNECTION_TIMEOUT: 30000, // 30 seconds
} as const;

// Validation Patterns
export const VALIDATION = {
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  OTP_REGEX: /^\d{6}$/,
  WALLET_ADDRESS_REGEX: /^0x[a-fA-F0-9]{40}$/,
  TRANSACTION_HASH_REGEX: /^0x[a-fA-F0-9]{64}$/,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MODAL_Z_INDEX: 1000,
  TOAST_DURATION: 5000, // 5 seconds
  LOADING_DEBOUNCE: 300, // 300ms
  ANIMATION_DURATION: 200, // 200ms
} as const;

// Authentication Headers
export const AUTH_HEADERS = {
  BEARER: 'Authorization',
  APP_TOKEN: 'X-App-Token',
  APP_SECRET: 'X-App-Secret',
} as const;

// External URLs
export const EXTERNAL_URLS = {
  WEBSITE: 'https://cryptomomo.africa',
  DOCUMENTATION: 'https://docs.cryptomomo.africa',
  SUPPORT: 'mailto:support@cryptomomo.africa',
  GITHUB: 'https://github.com/narteysarso/cryptomomo-developer-sdk',
  NPM: 'https://www.npmjs.com/package/cryptomomo-developer-sdk',
} as const;

// Feature Flags
export const FEATURES = {
  GASLESS_TRANSACTIONS: true,
  ACCOUNT_ABSTRACTION: true,
  MULTI_CHAIN: true,
  ANALYTICS: true,
  PUSH_NOTIFICATIONS: false, // Coming soon
} as const; 