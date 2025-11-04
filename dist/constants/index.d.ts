/**
 * CryptoMomo SDK Constants
 * Centralized location for all API URLs, endpoints, and configuration values
 */
export declare const API_CONFIG: {
    readonly BASE_URL: "http://localhost:3000/api/v1";
    readonly PRODUCTION_URL: "https://api.cryptomomo.africa/api/v1";
    readonly TIMEOUT: 30000;
    readonly RETRY_ATTEMPTS: 3;
    readonly RETRY_DELAY: 1000;
};
export declare const ENDPOINTS: {
    readonly CONNECTIONS: {
        readonly REQUEST: "/connections/request";
        readonly REGISTER: "/connections/register";
        readonly VERIFY: "/connections/verify";
        readonly REFRESH: "/connections/refresh";
        readonly GET_BY_ID: "/connections/:connectionId";
        readonly CHECK_STATUS: "/connections/check/status";
    };
    readonly TRANSACTIONS: {
        readonly SEND: "/transactions/send";
        readonly GASLESS: "/transactions/gasless";
        readonly CONFIRM: "/transactions/confirm";
        readonly STATUS: "/transactions/:transactionId/status";
        readonly HISTORY: "/transactions/history";
        readonly BALANCE: "/transactions/balance";
    };
};
export declare const ERROR_MESSAGES: {
    readonly NETWORK_ERROR: "Network connection failed. Please check your internet connection.";
    readonly TIMEOUT_ERROR: "Request timed out. Please try again.";
    readonly UNAUTHORIZED: "Authentication failed. Please check your credentials.";
    readonly INVALID_CREDENTIALS: "Invalid email or password.";
    readonly INVALID_TOKEN: "Invalid or expired token.";
    readonly INVALID_PHONE: "Please enter a valid phone number.";
    readonly INVALID_OTP: "Invalid or expired OTP.";
    readonly INVALID_APP_CREDENTIALS: "Invalid app token or app secret.";
    readonly VALIDATION_ERROR: "Invalid input data.";
    readonly DUPLICATE_EMAIL: "Email already exists.";
    readonly DEVELOPER_NOT_FOUND: "Developer not found.";
    readonly DAPP_NOT_FOUND: "DApp not found.";
    readonly CONNECTION_NOT_FOUND: "Connection not found.";
    readonly IP_NOT_WHITELISTED: "Your IP address is not whitelisted for this app.";
    readonly PLATFORM_MANAGER_NOT_FOUND: "Platform manager not found.";
    readonly RATE_LIMITED: "Too many requests. Please wait and try again.";
    readonly USER_NOT_FOUND: "Wallet account not found. Please register.";
    readonly REGISTRATION_REQUIRED: "Please complete registration to continue.";
};
export declare const SUCCESS_MESSAGES: {
    readonly OTP_GENERATED: "Connection code generated. Please confirm via USSD.";
    readonly CONNECTION_VERIFIED: "Connected successfully!";
    readonly TRANSACTION_SENT: "Transaction sent successfully!";
    readonly TRANSACTION_CONFIRMED: "Transaction confirmed!";
    readonly GASLESS_TRANSACTION_SENT: "Gasless transaction sent successfully!";
    readonly ACCOUNT_REGISTERED: "Account created successfully! Please claim your account via USSD.";
};
export declare const STORAGE_KEYS: {
    readonly CONNECTION_ID: "cryptomomo_connection_id";
    readonly PHONE_NUMBER: "cryptomomo_phone_number";
    readonly CONNECTION_STATUS: "cryptomomo_connection_status";
    readonly USER_PREFERENCES: "cryptomomo_user_preferences";
    readonly THEME_SETTINGS: "cryptomomo_theme_settings";
};
export declare const DEFAULTS: {
    readonly PHONE_COUNTRY_CODE: "+233";
    readonly OTP_LENGTH: 6;
    readonly OTP_EXPIRY: 300000;
    readonly TRANSACTION_TIMEOUT: 60000;
    readonly CONNECTION_TIMEOUT: 30000;
};
export declare const VALIDATION: {
    readonly PHONE_REGEX: RegExp;
    readonly OTP_REGEX: RegExp;
    readonly WALLET_ADDRESS_REGEX: RegExp;
    readonly TRANSACTION_HASH_REGEX: RegExp;
};
export declare const UI_CONSTANTS: {
    readonly MODAL_Z_INDEX: 1000;
    readonly TOAST_DURATION: 5000;
    readonly LOADING_DEBOUNCE: 300;
    readonly ANIMATION_DURATION: 200;
};
export declare const AUTH_HEADERS: {
    readonly BEARER: "Authorization";
    readonly APP_TOKEN: "X-App-Token";
    readonly APP_SECRET: "X-App-Secret";
};
export declare const EXTERNAL_URLS: {
    readonly WEBSITE: "https://cryptomomo.africa";
    readonly DOCUMENTATION: "https://docs.cryptomomo.africa";
    readonly SUPPORT: "mailto:support@cryptomomo.africa";
    readonly GITHUB: "https://github.com/narteysarso/cryptomomo-developer-sdk";
    readonly NPM: "https://www.npmjs.com/package/cryptomomo-developer-sdk";
};
export declare const FEATURES: {
    readonly GASLESS_TRANSACTIONS: true;
    readonly ACCOUNT_ABSTRACTION: true;
    readonly MULTI_CHAIN: true;
    readonly ANALYTICS: true;
    readonly PUSH_NOTIFICATIONS: false;
};
//# sourceMappingURL=index.d.ts.map