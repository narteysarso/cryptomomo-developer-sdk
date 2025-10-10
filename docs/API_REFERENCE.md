# CryptoMomo SDK API Reference

Complete API documentation for the CryptoMomo Developer SDK.

## Table of Contents

- [Components](#components)
  - [ConnectButton](#connectbutton)
  - [TransactionButton](#transactionbutton)
  - [UI Components](#ui-components)
- [Providers](#providers)
  - [CryptoMomoProvider](#cryptomomoprovider)
  - [ThemeProvider](#themeprovider)
- [Hooks](#hooks)
  - [useConnect](#useconnect)
  - [useTransaction](#usetransaction)
  - [useTheme](#usetheme)
- [Types](#types)
- [Error Classes](#error-classes)

## Components

### ConnectButton

Primary component for wallet connection via phone number and OTP verification.

```typescript
interface ConnectButtonProps {
  onConnect?: (response: WalletConnectionResponse) => void;
  onError?: (error: CryptoMomoError) => void;
  className?: string;
  children?: React.ReactNode;
  theme?: CryptoMomoTheme;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  showLogo?: boolean;
  modal?: boolean;
}
```

**Examples:**
```tsx
// Basic usage
<ConnectButton />

// Custom styling
<ConnectButton 
  variant="outline" 
  size="lg" 
  modal={false}
  theme={{ colors: { primary: 'hsl(262 83% 58%)' } }}
/>
```

### TransactionButton

Component for executing blockchain transactions with gasless support.

```typescript
interface TransactionButtonProps {
  transaction: TransactionRequest;
  onSuccess?: (response: TransactionResponse) => void;
  onError?: (error: CryptoMomoError) => void;
  className?: string;
  children?: React.ReactNode;
  theme?: CryptoMomoTheme;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  gasless?: boolean;
  showIcon?: boolean;
}
```

**Examples:**
```tsx
// Basic transaction
<TransactionButton
  transaction={{
    to: "0x742d35Cc6632C0532c718A0c5f4fD0B7C2c45C30",
    value: BigInt("1000000000000000000"),
  }}
  gasless={true}
/>
```

### UI Components

Individual shadcn/ui components available for custom interfaces.

#### Button

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

```tsx
import { Button } from 'cryptomomo-developer-sdk';

<Button variant="outline" size="lg">
  Custom Action
</Button>
```

#### Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

```tsx
import { Input } from 'cryptomomo-developer-sdk';

<Input
  type="text"
  placeholder="Enter value"
  className="w-full"
/>
```

#### Label

```typescript
interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}
```

```tsx
import { Label } from 'cryptomomo-developer-sdk';

<Label htmlFor="input-id">
  Field Label
</Label>
```

#### Dialog

```tsx
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from 'cryptomomo-developer-sdk';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text.
      </DialogDescription>
    </DialogHeader>
    <div>Dialog content here</div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Providers

### CryptoMomoProvider

Main provider that wraps your application and provides SDK configuration.

#### Props

```typescript
interface CryptoMomoProviderProps {
  children: React.ReactNode;
  config: CryptoMomoConfig;
}

interface CryptoMomoConfig {
  apiKey: string;
  dappId: string;
  baseUrl?: string;
  chainId?: number;
  paymasterAddress?: `0x${string}`;
  timeout?: number;
  retryAttempts?: number;
}
```

#### Usage

```tsx
<CryptoMomoProvider
  config={{
    apiKey: "cm_live_abc123...",
    dappId: "dapp_abc123...",
    baseUrl: "https://api.cryptomomo.africa",
    chainId: 1,
    timeout: 30000,
    retryAttempts: 3,
  }}
>
  <App />
</CryptoMomoProvider>
```

---

### ThemeProvider

Provider for global theme management.

#### Props

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: CryptoMomoTheme;
  defaultTheme?: CryptoMomoTheme;
}
```

#### Usage

```tsx
const customTheme = {
  colors: {
    primary: 'hsl(262 83% 58%)',
    background: 'hsl(0 0% 100%)',
  },
  borderRadius: '0.75rem',
};

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

## Hooks

### useConnect

Hook for building custom wallet connection interfaces.

```typescript
const {
  connect,
  verifyOTP,
  reset,
  isConnecting,
  isVerifying,
  isOTPSent,
  connectError,
  verifyError,
} = useConnect({
  onSuccess: (response) => console.log('Connected:', response),
  onError: (error) => console.error('Error:', error),
});
```

### useTransaction

Hook for building custom transaction interfaces.

```typescript
const {
  execute,
  isExecuting,
  isSuccess,
  data,
  error,
} = useTransaction({
  onSuccess: (response) => console.log('Success:', response),
  onError: (error) => console.error('Error:', error),
  gasless: true,
});
```

### useTheme

Hook for accessing and modifying themes.

```typescript
const { theme, setTheme } = useTheme();
```

## Types

### Core Configuration

```typescript
interface CryptoMomoConfig {
  apiKey: string;
  dappId: string;
  baseUrl?: string;
  chainId?: number;
  timeout?: number;
  retryAttempts?: number;
}

interface CryptoMomoTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
    // ... other colors
  };
  borderRadius?: string;
  fontFamily?: string;
}
```

### Transaction Types

```typescript
interface TransactionRequest {
  to: `0x${string}`;
  value?: bigint;
  data?: `0x${string}`;
  gasLimit?: bigint;
}

interface TransactionResponse {
  hash: `0x${string}`;
  status: 'pending' | 'success' | 'failed';
  gasUsed?: bigint;
  blockNumber?: bigint;
}
```

## Error Classes

```typescript
class CryptoMomoError extends Error {
  code: string;
  statusCode: number;
  details?: any;
}

class ValidationError extends CryptoMomoError {}
class AuthenticationError extends CryptoMomoError {}
class NetworkError extends CryptoMomoError {}
```

## UI Components

All shadcn/ui components are available:

```tsx
import { 
  Button, 
  Input, 
  Label, 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle 
} from 'cryptomomo-developer-sdk';
```

## Utility Functions

### cn

Utility for combining CSS classes with Tailwind merge support.

```typescript
function cn(...inputs: ClassValue[]): string;
```

```tsx
import { cn } from 'cryptomomo-developer-sdk';

<div className={cn(
  "base-class",
  isActive && "active-class",
  "override-class"
)} />
```

## Constants

The SDK provides a comprehensive set of constants for configuration, validation, and error handling:

### API Configuration

```typescript
import { API_CONFIG } from '@cryptomomo/developer-sdk';

// Default API configuration
console.log(API_CONFIG.BASE_URL); // 'https://api.cryptomomo.africa/v1'
console.log(API_CONFIG.TIMEOUT); // 30000
console.log(API_CONFIG.RETRY_ATTEMPTS); // 3
```

### Error Messages

```typescript
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@cryptomomo/developer-sdk';

// Standardized error messages
console.log(ERROR_MESSAGES.INVALID_PHONE); // 'Please enter a valid phone number.'
console.log(ERROR_MESSAGES.UNAUTHORIZED); // 'Authentication failed. Please reconnect your wallet.'
console.log(SUCCESS_MESSAGES.WALLET_CONNECTED); // 'Wallet connected successfully!'
```

### Validation Patterns

```typescript
import { VALIDATION, formatPhoneNumber, isValidPhoneNumber } from '@cryptomomo/developer-sdk';

// Validate phone number
const phone = '+233123456789';
const isValid = isValidPhoneNumber(phone); // Uses VALIDATION.PHONE_REGEX

// Format phone number with default country code
const formatted = formatPhoneNumber('0123456789'); // '+233123456789'
```

### Default Values

```typescript
import { DEFAULTS } from '@cryptomomo/developer-sdk';

console.log(DEFAULTS.PHONE_COUNTRY_CODE); // '+233' (Ghana)
console.log(DEFAULTS.OTP_LENGTH); // 6
console.log(DEFAULTS.OTP_EXPIRY); // 300000 (5 minutes)
```

### Storage Keys

```typescript
import { STORAGE_KEYS } from '@cryptomomo/developer-sdk';

// Consistent storage keys across the SDK
localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
```

### Feature Flags

```typescript
import { FEATURES } from '@cryptomomo/developer-sdk';

if (FEATURES.GASLESS_TRANSACTIONS) {
  // Enable gasless transaction UI
}

if (FEATURES.ACCOUNT_ABSTRACTION) {
  // Enable Account Abstraction features
}
```

### External URLs

```typescript
import { EXTERNAL_URLS } from '@cryptomomo/developer-sdk';

console.log(EXTERNAL_URLS.WEBSITE); // 'https://cryptomomo.africa'
console.log(EXTERNAL_URLS.DOCUMENTATION); // 'https://docs.cryptomomo.africa'
console.log(EXTERNAL_URLS.SUPPORT); // 'mailto:support@cryptomomo.africa'
``` 