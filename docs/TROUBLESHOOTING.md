# CryptoMomo SDK Troubleshooting Guide

Common issues and solutions when using the CryptoMomo Developer SDK.

## Installation Issues

### Module Resolution Errors

**Problem:** Cannot resolve module 'cryptomomo-developer-sdk'

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# For TypeScript projects
npm install --save-dev @types/react @types/react-dom
```

### Peer Dependency Warnings

**Problem:** Peer dependency warnings for React

**Solution:**
```bash
# Install required peer dependencies
npm install react@^18.0.0 react-dom@^18.0.0

# Or for React 17
npm install react@^17.0.0 react-dom@^17.0.0
```

## Styling Issues

### CSS Not Loading

**Problem:** Components appear unstyled

**Solutions:**
```tsx
// 1. Import CSS in your main App component
import 'cryptomomo-developer-sdk/dist/styles.css';

// 2. Or in your CSS file
@import 'cryptomomo-developer-sdk/dist/styles.css';

// 3. For Next.js, import in _app.tsx
import 'cryptomomo-developer-sdk/dist/styles.css';
```

### Tailwind CSS Conflicts

**Problem:** Tailwind styles overriding SDK styles

**Solution:**
```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/cryptomomo-developer-sdk/dist/**/*.js"
  ],
  // Add SDK-specific preflight exclusions
  corePlugins: {
    preflight: false, // Disable if conflicts occur
  },
}
```

### Theme Not Applying

**Problem:** Custom theme not visible

**Solutions:**
```tsx
// 1. Ensure ThemeProvider wraps components
<ThemeProvider theme={yourTheme}>
  <ConnectButton /> {/* Will receive theme */}
</ThemeProvider>

// 2. Apply theme directly to component
<ConnectButton theme={yourTheme} />

// 3. Check theme format (use HSL)
const correctTheme = {
  colors: {
    primary: 'hsl(262 83% 58%)', // ✅ Correct
    // primary: '#8b5cf6',        // ❌ Wrong format
  }
};
```

## TypeScript Issues

### Type Definition Errors

**Problem:** TypeScript cannot find type definitions

**Solutions:**
```bash
# Install type definitions
npm install --save-dev @types/react @types/react-dom

# Clear TypeScript cache
npx tsc --build --clean
```

### Import Errors

**Problem:** Cannot import types

**Solution:**
```tsx
// Correct import syntax
import type { 
  CryptoMomoTheme,
  ConnectButtonProps,
  TransactionButtonProps 
} from 'cryptomomo-developer-sdk';

// Or import with components
import { 
  ConnectButton,
  type CryptoMomoTheme 
} from 'cryptomomo-developer-sdk';
```

## Runtime Errors

### Provider Configuration Errors

**Problem:** "Invalid API key" or "DApp not found"

**Solutions:**
```tsx
// 1. Check environment variables
console.log('API Key:', process.env.REACT_APP_CRYPTOMOMO_API_KEY);
console.log('DApp ID:', process.env.REACT_APP_CRYPTOMOMO_DAPP_ID);

// 2. Verify configuration format
const config = {
  apiKey: "cm_live_...", // Must start with cm_live_ or cm_test_
  dappId: "dapp_...",    // Must start with dapp_
  chainId: 1,            // Valid chain ID
};

// 3. Check API endpoint
const config = {
  apiKey: "your-key",
  dappId: "your-dapp-id",
  baseUrl: "https://api.cryptomomo.africa", // Correct URL
};
```

### Connection Errors

**Problem:** Phone connection fails

**Solutions:**
```tsx
// 1. Validate phone number format
const isValidPhone = (phone: string) => {
  return /^\+?[\d\s\-\(\)]+$/.test(phone) && phone.length >= 10;
};

// 2. Handle errors properly
<ConnectButton
  onError={(error) => {
    console.error('Connection error:', error);
    if (error.code === 'INVALID_PHONE') {
      alert('Please enter a valid phone number');
    } else if (error.code === 'RATE_LIMITED') {
      alert('Too many attempts. Please try again later.');
    }
  }}
/>

// 3. Check network connectivity
const config = {
  apiKey: "your-key",
  dappId: "your-dapp-id",
  timeout: 30000, // Increase timeout
  retryAttempts: 3, // Add retry logic
};
```

### Transaction Errors

**Problem:** Transactions fail to execute

**Solutions:**
```tsx
// 1. Validate transaction parameters
const isValidAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const isValidAmount = (amount: bigint) => {
  return amount > 0n && amount <= BigInt("1000000000000000000000"); // Max 1000 ETH
};

// 2. Handle specific error types
<TransactionButton
  transaction={{
    to: "0x742d35Cc6632C0532c718A0c5f4fD0B7C2c45C30",
    value: BigInt("1000000000000000000"),
  }}
  onError={(error) => {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      alert('Insufficient balance for transaction');
    } else if (error.code === 'NETWORK_ERROR') {
      alert('Network error. Please try again.');
    } else if (error.code === 'USER_REJECTED') {
      alert('Transaction was cancelled');
    }
  }}
/>

// 3. Check wallet connection
const { isConnected } = useIsConnected();
if (!isConnected) {
  alert('Please connect your wallet first');
  return;
}
```

## Performance Issues

### Slow Component Loading

**Problem:** Components take too long to load

**Solutions:**
```tsx
// 1. Use dynamic imports
import { lazy, Suspense } from 'react';

const ConnectButton = lazy(() => 
  import('cryptomomo-developer-sdk').then(module => ({
    default: module.ConnectButton
  }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConnectButton />
    </Suspense>
  );
}

// 2. Memoize theme objects
const theme = useMemo(() => ({
  colors: {
    primary: 'hsl(262 83% 58%)',
  }
}), []);

// 3. Optimize re-renders
const MemoizedConnectButton = memo(ConnectButton);
```

### Bundle Size Issues

**Problem:** Large bundle size

**Solutions:**
```tsx
// 1. Use tree shaking
import { ConnectButton } from 'cryptomomo-developer-sdk';
// Instead of: import * as CryptoMomo from 'cryptomomo-developer-sdk';

// 2. Import only needed components
import { Button, Input } from 'cryptomomo-developer-sdk';

// 3. Use dynamic imports for large features
const TransactionButton = lazy(() => 
  import('cryptomomo-developer-sdk').then(m => ({ 
    default: m.TransactionButton 
  }))
);
```

## Build Issues

### Webpack Configuration

**Problem:** Webpack build errors

**Solution:**
```js
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer"),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
```

### Vite Configuration

**Problem:** Vite build errors

**Solution:**
```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
});
```

### Next.js Configuration

**Problem:** Next.js SSR errors

**Solution:**
```js
// next.config.js
module.exports = {
  transpilePackages: ['cryptomomo-developer-sdk'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
    };
    return config;
  },
};
```

## Development Tips

### Debug Mode

Enable debug logging:

```tsx
// Add to your app initialization
if (process.env.NODE_ENV === 'development') {
  window.CRYPTOMOMO_DEBUG = true;
}

// Or set via localStorage
localStorage.setItem('CRYPTOMOMO_DEBUG', 'true');
```

### Error Boundary

Wrap SDK components with error boundaries:

```tsx
class SDKErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SDK Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the wallet component.</div>;
    }

    return this.props.children;
  }
}

// Usage
<SDKErrorBoundary>
  <ConnectButton />
</SDKErrorBoundary>
```

### Network Debugging

Monitor network requests:

```tsx
// Add request interceptor
const config = {
  apiKey: "your-key",
  dappId: "your-dapp-id",
  onRequest: (url, options) => {
    console.log('API Request:', url, options);
  },
  onResponse: (response) => {
    console.log('API Response:', response);
  },
  onError: (error) => {
    console.error('API Error:', error);
  },
};
```

## Getting Help

### Check Console Logs

Always check browser console for detailed error messages:

```tsx
// Enable verbose logging
localStorage.setItem('debug', 'cryptomomo:*');
```

### Verify SDK Version

```bash
# Check installed version
npm list cryptomomo-developer-sdk

# Update to latest version
npm update cryptomomo-developer-sdk
```

### Report Issues

When reporting issues, include:

1. SDK version
2. React version
3. Browser and version
4. Complete error message
5. Minimal reproduction code
6. Steps to reproduce

### Community Support

- 📧 Email: support@cryptomomo.africa
- 💬 Discord: [Join our community](https://discord.gg/cryptomomo)
- 🐛 GitHub Issues: [Report bugs](https://github.com/narteysarso/cryptomomo-developer-sdk/issues)
- 📖 Documentation: [docs.cryptomomo.africa](https://docs.cryptomomo.africa) 