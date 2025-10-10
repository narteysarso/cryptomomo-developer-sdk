# CryptoMomo SDK - Developer Guide

Complete guide for integrating CryptoMomo SDK in your DApp.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Frontend Integration](#frontend-integration)
- [Backend Integration (Optional)](#backend-integration-optional)
- [React Integration](#react-integration)
- [Advanced Usage](#advanced-usage)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The CryptoMomo SDK uses a **two-phase authentication** system that's simple and secure:

1. **Phase 1: App Token** - Public token for connection requests (safe for frontend)
2. **Phase 2: Session Token** - Automatic after OTP verification (managed by SDK)

### Architecture (Simplified!)

```
┌──────────────────────────────────────┐
│         Your Frontend App            │
│                                      │
│  const client = new CryptoMomo({     │
│    appToken: 'public-token'          │
│  });                                 │
│                                      │
│  ✅ requestConnection(phone)         │
│  ✅ verifyOTP(id, otp)               │
│     ↓ SDK auto-switches to session   │
│  ✅ sendTransaction(...)             │
│  ✅ getBalance(...)                  │
│                                      │
└──────────┬───────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │ CryptoMomo   │
    │     API      │
    └──────────────┘
```

**No backend required!** The SDK handles everything automatically.

## Installation

```bash
npm install @cryptomomo/sdk
# or
yarn add @cryptomomo/sdk
# or
pnpm add @cryptomomo/sdk
```

### TypeScript

The SDK is written in TypeScript and includes type definitions.

```bash
npm install --save-dev typescript @types/react @types/node
```

## Quick Start

```typescript
import { CryptoMomoClient } from '@cryptomomo/sdk';

// 1. Initialize with app token (safe for frontend!)
const client = new CryptoMomoClient({
  appToken: 'your-app-token', // Get from dashboard
  environment: 'production',
});

// 2. Request connection
const connection = await client.requestConnection('+233123456789');
console.log('OTP sent to user');

// 3. Verify OTP
const verified = await client.verifyOTP(connection.id, '123456');
console.log('✅ Connected!');
// SDK automatically switches to session token internally

// 4. Send transaction
const tx = await client.sendTransaction({
  connectionId: verified.id,
  to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  value: '1000000000000000000',
});
console.log('Transaction created:', tx.confirmationCode);
```

That's it! The SDK handles all authentication automatically.

## Authentication

### Two-Phase System

**Phase 1: App Token (Public)**
- Used for: `requestConnection()`, `verifyOTP()`
- Safe to expose in frontend code
- No sensitive operations allowed

**Phase 2: Session Token (Automatic)**
- Used for: `sendTransaction()`, `getBalance()`, etc.
- Generated after OTP verification
- Managed automatically by SDK
- Expires after 30 minutes

### Configuration

```typescript
import { CryptoMomoClient } from '@cryptomomo/sdk';

const client = new CryptoMomoClient({
  // Required
  appToken: 'your-app-token', // Get from dashboard

  // Optional
  environment: 'production', // or 'development'
  baseUrl: 'https://api.cryptomomo.com', // Custom URL
  timeout: 30000, // Request timeout (ms)
  retryAttempts: 3, // Number of retries
});
```

## Backend Integration (Optional)

**Note**: Backend integration is optional! You can use the SDK directly in your frontend as shown in Quick Start. Only use a backend if you need additional server-side logic or want to add custom business rules.

### When to Use Backend

Use backend integration when you need:
- Custom business logic before sending transactions
- Additional validation or authorization
- Server-side transaction monitoring
- Integration with other backend services

### Setup (Optional)

If you need backend integration, you can use the SDK on the server side:

```typescript
// backend/services/cryptomomo.service.ts
import { CryptoMomoClient } from '@cryptomomo/sdk';

// Initialize with app token (same as frontend)
const client = new CryptoMomoClient({
  appToken: process.env.CRYPTOMOMO_APP_TOKEN!,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
});

export class CryptoMomoService {
  /**
   * Optional: Add server-side business logic
   */
  async validateAndSendTransaction(
    connectionId: string,
    to: string,
    value: string
  ) {
    // Add your custom validation here
    if (!this.isValidAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    // Use session token (obtained after OTP verification)
    const tx = await client.sendTransaction({
      connectionId,
      to,
      value,
    });

    // Add logging, monitoring, etc.
    console.log('Transaction created:', tx.id);

    return tx;
  }

  private isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}

export const cryptoMomoService = new CryptoMomoService();
```

### Express.js Routes (Optional)

```typescript
// backend/routes/transaction.routes.ts
import express from 'express';
import { cryptoMomoService } from '../services/cryptomomo.service';

const router = express.Router();

/**
 * POST /api/transactions/send
 * Optional backend endpoint with custom validation
 */
router.post('/send', async (req, res) => {
  try {
    const { connectionId, to, value } = req.body;

    // Add your custom authorization checks here
    if (!req.user?.hasPermission('send_transaction')) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const tx = await cryptoMomoService.validateAndSendTransaction(
      connectionId,
      to,
      value
    );

    res.json({ success: true, transaction: tx });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
```

**Remember**: Most apps don't need this! You can call `client.sendTransaction()` directly from your frontend.

### Environment Variables (Backend)

If using backend integration:

```bash
# .env
CRYPTOMOMO_APP_TOKEN=your_app_token_from_dashboard
NODE_ENV=development
PORT=3000
```

## Frontend Integration

### Direct Usage (Recommended)

The simplest way to use the SDK:

```typescript
// frontend/services/cryptomomo.ts
import { CryptoMomoClient } from '@cryptomomo/sdk';

// Initialize once with app token (safe for frontend!)
const client = new CryptoMomoClient({
  appToken: import.meta.env.VITE_CRYPTOMOMO_APP_TOKEN, // or process.env.NEXT_PUBLIC_CRYPTOMOMO_APP_TOKEN
  environment: 'production',
});

export class CryptoMomoService {
  private connectionId: string | null = null;

  /**
   * Step 1: Request connection
   */
  async connect(phoneNumber: string) {
    const connection = await client.requestConnection(phoneNumber);
    this.connectionId = connection.id;

    // Optional: Store connection ID
    localStorage.setItem('cryptomomo_connection', connection.id);

    return connection;
  }

  /**
   * Step 2: Verify OTP
   */
  async verify(otp: string) {
    if (!this.connectionId) {
      throw new Error('No connection initiated');
    }

    const verified = await client.verifyOTP(this.connectionId, otp);
    // ✨ SDK automatically switches to session token!

    // Optional: Persist session token
    const sessionToken = client.getSessionToken();
    if (sessionToken) {
      localStorage.setItem('cryptomomo_session', sessionToken);
    }

    return verified;
  }

  /**
   * Restore session from localStorage
   */
  restoreSession() {
    const sessionToken = localStorage.getItem('cryptomomo_session');
    const connectionId = localStorage.getItem('cryptomomo_connection');

    if (sessionToken && connectionId) {
      client.setSessionToken(sessionToken);
      this.connectionId = connectionId;
      return true;
    }

    return false;
  }

  /**
   * Clear session (logout)
   */
  disconnect() {
    client.clearSessionToken();
    this.connectionId = null;
    localStorage.removeItem('cryptomomo_session');
    localStorage.removeItem('cryptomomo_connection');
  }

  /**
   * Send transaction
   */
  async sendTransaction(to: string, value: string, data?: string) {
    if (!this.connectionId) {
      throw new Error('Not connected');
    }

    try {
      const tx = await client.sendTransaction({
        connectionId: this.connectionId,
        to: to as `0x${string}`,
        value,
        data: data as `0x${string}`,
      });

      return tx;
    } catch (error) {
      // Handle session expiration
      if (error.code === 'SESSION_EXPIRED') {
        this.disconnect();
        throw new Error('Session expired. Please reconnect.');
      }
      throw error;
    }
  }

  /**
   * Get balance
   */
  async getBalance(tokenAddress?: string, chainId?: number) {
    if (!this.connectionId) {
      throw new Error('Not connected');
    }

    return client.getBalance(this.connectionId, tokenAddress, chainId);
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId: string) {
    return client.getTransactionStatus(transactionId);
  }

  /**
   * Check if connected
   */
  isConnected() {
    return client.isUsingSessionToken() && this.connectionId !== null;
  }
}

export const cryptoMomo = new CryptoMomoService();
```

### React Integration

#### Context Provider

```tsx
// frontend/contexts/CryptoMomoContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CryptoMomoClient, ConnectionInfo, TransactionResponse } from '@cryptomomo/sdk';

interface CryptoMomoContextType {
  connection: ConnectionInfo | null;
  isConnected: boolean;
  connect: (phoneNumber: string) => Promise<ConnectionInfo>;
  verify: (otp: string) => Promise<ConnectionInfo>;
  disconnect: () => void;
  sendTransaction: (to: string, value: string, data?: string) => Promise<TransactionResponse>;
}

const CryptoMomoContext = createContext<CryptoMomoContextType | null>(null);

// Initialize SDK once (outside component)
const client = new CryptoMomoClient({
  appToken: process.env.REACT_APP_CRYPTOMOMO_APP_TOKEN!,
  environment: 'production',
});

export function CryptoMomoProvider({ children }: { children: React.ReactNode }) {
  const [connection, setConnection] = useState<ConnectionInfo | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem('cryptomomo_session');
    const savedConnectionId = localStorage.getItem('cryptomomo_connection');

    if (sessionToken && savedConnectionId) {
      client.setSessionToken(sessionToken);
      setConnectionId(savedConnectionId);
      // Optionally fetch full connection info
    }
  }, []);

  const connect = async (phoneNumber: string) => {
    const conn = await client.requestConnection(phoneNumber);
    setConnectionId(conn.id);
    localStorage.setItem('cryptomomo_connection', conn.id);
    return conn;
  };

  const verify = async (otp: string) => {
    if (!connectionId) throw new Error('No pending connection');

    const verified = await client.verifyOTP(connectionId, otp);
    // ✨ SDK automatically switched to session token!

    setConnection(verified);

    // Persist session
    const sessionToken = client.getSessionToken();
    if (sessionToken) {
      localStorage.setItem('cryptomomo_session', sessionToken);
    }

    return verified;
  };

  const disconnect = () => {
    client.clearSessionToken();
    setConnection(null);
    setConnectionId(null);
    localStorage.removeItem('cryptomomo_session');
    localStorage.removeItem('cryptomomo_connection');
  };

  const sendTransaction = async (to: string, value: string, data?: string) => {
    if (!connectionId) throw new Error('Not connected');

    return client.sendTransaction({
      connectionId,
      to: to as `0x${string}`,
      value,
      data: data as `0x${string}`,
    });
  };

  return (
    <CryptoMomoContext.Provider
      value={{
        connection,
        isConnected: client.isUsingSessionToken() && !!connection,
        connect,
        verify,
        disconnect,
        sendTransaction,
      }}
    >
      {children}
    </CryptoMomoContext.Provider>
  );
}

export function useCryptoMomo() {
  const context = useContext(CryptoMomoContext);
  if (!context) throw new Error('useCryptoMomo must be used within CryptoMomoProvider');
  return context;
}
```

#### Usage in Components

```tsx
// App.tsx
import { CryptoMomoProvider } from './contexts/CryptoMomoContext';
import { ConnectFlow } from './components/ConnectFlow';

function App() {
  return (
    <CryptoMomoProvider>
      <ConnectFlow />
    </CryptoMomoProvider>
  );
}
```

```tsx
// components/ConnectFlow.tsx
import { useState } from 'react';
import { useCryptoMomo } from '../contexts/CryptoMomoContext';

export function ConnectFlow() {
  const { isConnected, connect, verify, disconnect, sendTransaction } = useCryptoMomo();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'connected'>('phone');

  const handleConnect = async () => {
    try {
      await connect(phoneNumber);
      setStep('otp');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerify = async () => {
    try {
      await verify(otp);
      setStep('connected');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSend = async () => {
    try {
      const tx = await sendTransaction(
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        '1000000000000000000'
      );
      alert(`Transaction created! Code: ${tx.confirmationCode}`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (step === 'phone') {
    return (
      <div>
        <h2>Connect Your Wallet</h2>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+233123456789"
        />
        <button onClick={handleConnect}>Send OTP</button>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div>
        <h2>Verify OTP</h2>
        <p>Enter the 6-digit code sent to {phoneNumber}</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          maxLength={6}
        />
        <button onClick={handleVerify}>Verify</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Connected!</h2>
      <button onClick={handleSend}>Send Transaction</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

## Environment Variables (Frontend)

For frontend apps, use environment variables to store your app token:

```bash
# .env (React/Vite)
VITE_CRYPTOMOMO_APP_TOKEN=your_app_token_here

# .env.local (Next.js)
NEXT_PUBLIC_CRYPTOMOMO_APP_TOKEN=your_app_token_here

# .env (Create React App)
REACT_APP_CRYPTOMOMO_APP_TOKEN=your_app_token_here
```

Then use it in your code:

```typescript
const client = new CryptoMomoClient({
  appToken: import.meta.env.VITE_CRYPTOMOMO_APP_TOKEN, // Vite
  // or process.env.NEXT_PUBLIC_CRYPTOMOMO_APP_TOKEN // Next.js
  // or process.env.REACT_APP_CRYPTOMOMO_APP_TOKEN // CRA
  environment: 'production',
});
```

## Advanced Usage

### Transaction History

```typescript
const history = await client.getTransactionHistory({
  connectionId: connectionId,
  limit: 10,
  offset: 0,
  status: 'completed',
});

console.log('Recent transactions:', history);
```

### Gasless Transactions

```typescript
const tx = await client.sendGaslessTransaction({
  connectionId: connectionId,
  to: '0x...',
  value: '1000000000000000000',
  paymasterAddress: '0x...', // Your paymaster
  sponsorType: 'full',
});
```

### Error Handling

```typescript
try {
  const tx = await client.sendTransaction(request);
} catch (error) {
  if (error.code === 'SESSION_EXPIRED') {
    // Redirect to login
    window.location.href = '/connect';
  } else if (error.code === 'INSUFFICIENT_BALANCE') {
    // Show balance error
    alert('Insufficient balance');
  } else {
    // Generic error
    console.error(error);
  }
}
```

## Security Best Practices

### 1. App Token is Public (Safe!)

The app token is **safe to expose** in your frontend code:

```typescript
// ✅ GOOD - App token is public and safe!
const client = new CryptoMomoClient({
  appToken: 'your-app-token', // Public, no secrets!
});
```

**Why?** The app token only allows:
- Connection requests (sending OTP)
- OTP verification

It does NOT allow:
- Sending transactions
- Accessing sensitive data
- Administrative operations

### 2. Session Token is Private

After OTP verification, the SDK uses a session token internally:

```typescript
// Session token is managed automatically by SDK
await client.verifyOTP(connectionId, otp);
// ✨ SDK now uses session token internally

// Optional: Persist session token for later
const sessionToken = client.getSessionToken();
localStorage.setItem('cryptomomo_session', sessionToken);
```

### 3. Use Environment Variables

```bash
# Frontend .env
VITE_CRYPTOMOMO_APP_TOKEN=your_app_token
```

```typescript
const client = new CryptoMomoClient({
  appToken: import.meta.env.VITE_CRYPTOMOMO_APP_TOKEN,
});
```

### 4. Handle Token Expiration

```typescript
async function sendTransactionWithRetry(request) {
  try {
    return await client.sendTransaction(request);
  } catch (error) {
    if (error.code === 'SESSION_EXPIRED') {
      // Clear expired token
      localStorage.removeItem('cryptomomo_session');
      // Redirect to re-auth
      window.location.href = '/connect';
    }
    throw error;
  }
}
```

### 5. Use HTTPS in Production

Always use HTTPS to prevent token interception.

### 6. Implement CSP Headers

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; connect-src https://api.cryptomomo.com;">
```

### 7. Validate User Input

```typescript
// Validate phone numbers
function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
}

// Validate addresses
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
```

## Troubleshooting

### "Missing X-App-Token header"

**Cause**: App token not provided in SDK initialization.

**Solution**:
```typescript
const client = new CryptoMomoClient({
  appToken: 'your-app-token', // Required!
});
```

### "Session token has expired"

**Cause**: Token lifetime is 30 minutes.

**Solution**: Re-authenticate user.

```typescript
if (error.code === 'SESSION_EXPIRED') {
  localStorage.clear();
  window.location.href = '/connect';
}
```

### "Connection not found"

**Cause**: Invalid connectionId.

**Solution**: Ensure you're using the connectionId from verification response.

### "Invalid phone number format"

**Cause**: Phone number not in E.164 format.

**Solution**: Use format `+[country_code][number]`

```typescript
// ✅ Correct
connect('+233123456789');

// ❌ Wrong
connect('0123456789');
connect('123456789');
```

## Complete Example

See the `/examples` directory for complete implementations:

- `examples/backend-express` - Express.js backend
- `examples/frontend-react` - React frontend
- `examples/nextjs` - Next.js full-stack

## Support

- **Documentation**: https://docs.cryptomomo.com
- **Email**: support@cryptomomo.com
- **GitHub**: https://github.com/cryptomomo/sdk
- **Discord**: https://discord.gg/cryptomomo

## License

MIT
