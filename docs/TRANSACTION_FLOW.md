# Transaction Flow Component

Complete UI component for handling transactions from preview through to status tracking, with 2FA confirmation code display.

## Overview

The `TransactionFlowDialog` and `TransactionFlowButton` components provide a full-featured transaction experience with:

- **Transaction Preview** - Shows transaction details and confirmation prompt
- **Confirmation Code Display** - Displays 6-digit code with countdown timer
- **Real-time Status Tracking** - Polls transaction status every 3 seconds
- **Success/Error States** - Shows transaction details or error messages

## Components

### TransactionFlowButton

A button that opens the full transaction flow dialog.

```tsx
import { TransactionFlowButton } from 'cryptomomo-developer-sdk';

function SendTokens() {
  return (
    <TransactionFlowButton
      transaction={{
        to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        value: '1000000000000000000', // 1 ETH in wei
      }}
      gasless={true}
      onSuccess={(response) => {
        console.log('Transaction complete!', response);
      }}
      onError={(error) => {
        console.error('Transaction failed:', error);
      }}
    >
      Send 1 ETH
    </TransactionFlowButton>
  );
}
```

### TransactionFlowDialog

A headless dialog component for more control.

```tsx
import { TransactionFlowDialog } from 'cryptomomo-developer-sdk';
import { useState } from 'react';

function CustomTransactionFlow() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Send Transaction
      </button>

      <TransactionFlowDialog
        open={open}
        onOpenChange={setOpen}
        transaction={{
          to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          value: '1000000000000000000',
          data: '0x', // Optional contract data
          chainId: 1, // Optional chain ID
        }}
        gasless={false}
        onSuccess={(response) => {
          console.log('Success:', response);
        }}
        onError={(error) => {
          console.error('Error:', error);
        }}
      />
    </>
  );
}
```

## Transaction Flow Steps

### 1. Preview Step

Shows transaction details and allows user to review before submitting:
- Recipient address
- Value (formatted in ETH)
- Contract data (if present)
- Chain ID
- Gasless indicator (if enabled)
- Warning about 2FA confirmation

**User actions:**
- Cancel - Closes dialog
- Continue - Submits transaction

### 2. Confirmation Code Step

After transaction submission, displays:
- Large 6-digit confirmation code
- Copy to clipboard button
- Countdown timer (5 minutes)
- Step-by-step instructions for USSD confirmation

**User actions:**
- Close - Closes dialog but transaction remains pending
- Track Status - Moves to status tracking step

**Automatic transitions:**
- Code expires → Moves to error step
- User confirms via USSD → Backend updates status → Moves to tracking step

### 3. Status Tracking Step

Real-time transaction status with visual timeline:
- Awaiting Confirmation (yellow clock icon)
- Confirmed (blue checkmark)
- Executing (blue loading spinner)
- Completed (green checkmark)

Shows transaction hash when available with link to block explorer.

**Polling:**
- Updates every 3 seconds
- Stops when status is: completed, failed, or expired

**User actions:**
- Close - Only enabled when not executing

**Automatic transitions:**
- Status = completed → Moves to complete step
- Status = failed/expired → Moves to error step

### 4. Complete Step

Success state showing:
- Green checkmark icon
- Transaction ID
- Transaction hash
- Block number (if available)
- Gas used (if available)
- Link to block explorer

**User actions:**
- View on Explorer - Opens transaction in Etherscan
- Done - Closes dialog

### 5. Error Step

Error state showing:
- Red X icon
- Error message
- Appropriate message for:
  - Code expired
  - Transaction failed
  - Network errors
  - Validation errors

**User actions:**
- Close - Closes dialog

## Props

### TransactionFlowButtonProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `transaction` | `Omit<TransactionRequest, 'connectionId'>` | Yes | Transaction details (to, value, data, etc.) |
| `gasless` | `boolean` | No | Enable gasless transaction (default: false) |
| `onSuccess` | `(response: TransactionResponse) => void` | No | Callback on transaction success |
| `onError` | `(error: CryptoMomoError) => void` | No | Callback on transaction error |
| `children` | `React.ReactNode` | No | Button label |
| `className` | `string` | No | Additional CSS classes |
| `disabled` | `boolean` | No | Disable button |
| `variant` | `'default' \| 'outline' \| 'secondary' \| 'ghost' \| 'destructive'` | No | Button variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | No | Button size |
| `showIcon` | `boolean` | No | Show send/zap icon (default: true) |

### TransactionFlowDialogProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Dialog open state |
| `onOpenChange` | `(open: boolean) => void` | Yes | Callback to change open state |
| `transaction` | `Omit<TransactionRequest, 'connectionId'>` | Yes | Transaction details |
| `gasless` | `boolean` | No | Enable gasless transaction |
| `onSuccess` | `(response: TransactionResponse) => void` | No | Callback on success |
| `onError` | `(error: CryptoMomoError) => void` | No | Callback on error |

## Transaction Object

```typescript
interface TransactionRequest {
  to: `0x${string}`;              // Recipient address
  value?: string;                  // Amount in wei (default: '0')
  data?: `0x${string}`;            // Contract call data (default: '0x')
  chainId?: number;                // Chain ID (default: from config)
  gasLimit?: string;               // Gas limit
  maxFeePerGas?: string;           // Max fee per gas
  maxPriorityFeePerGas?: string;   // Max priority fee per gas
}
```

## Response Object

```typescript
interface TransactionResponse {
  id: string;                      // Transaction record ID
  confirmationCode: string;         // 6-character code for USSD
  codeExpiresAt: Date;             // Code expiration time
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
```

## Complete Example

```tsx
import {
  CryptoMomoProvider,
  ConnectButton,
  TransactionFlowButton
} from 'cryptomomo-developer-sdk';
import { useState } from 'react';

function App() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <CryptoMomoProvider
      appToken="your-app-token"
      appSecret="your-app-secret"
      environment="development"
    >
      <div className="p-4 space-y-4">
        <h1>Send Tokens</h1>

        {/* Connect user first */}
        <ConnectButton />

        {/* Transaction form */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Amount (ETH)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Transaction button with full flow */}
        <TransactionFlowButton
          transaction={{
            to: recipient as `0x${string}`,
            value: (parseFloat(amount || '0') * 1e18).toString(),
          }}
          gasless={true}
          onSuccess={(response) => {
            console.log('Transaction complete!', response);
            alert(`Transaction sent! Hash: ${response.txHash}`);
          }}
          onError={(error) => {
            console.error('Transaction failed:', error);
            alert(`Error: ${error.message}`);
          }}
          disabled={!recipient || !amount}
        >
          Send {amount || '0'} ETH
        </TransactionFlowButton>
      </div>
    </CryptoMomoProvider>
  );
}

export default App;
```

## Features

### Automatic Status Updates
- Polls transaction status every 3 seconds
- Stops polling when terminal state reached
- Updates UI in real-time

### Countdown Timer
- Shows time remaining for code validity
- Updates every second
- Automatically transitions to error when expired

### Copy to Clipboard
- One-click copy of confirmation code
- Visual feedback (checkmark)
- Resets after 2 seconds

### Block Explorer Integration
- Automatic link generation for transaction hash
- Opens in new tab
- Configurable via constants

### Error Handling
- Network errors
- Validation errors
- Authentication errors
- Expired codes
- Failed transactions

### Responsive Design
- Mobile-friendly
- Dialog adapts to screen size
- Touch-friendly buttons

## Customization

### Custom Styling

Use `className` prop for custom styling:

```tsx
<TransactionFlowButton
  transaction={tx}
  className="bg-purple-600 hover:bg-purple-700 text-white"
  variant="default"
  size="lg"
>
  Send with Custom Style
</TransactionFlowButton>
```

### Custom Block Explorer

Update constants to use different block explorer:

```typescript
// In your app
const BLOCK_EXPLORER_URL = 'https://polygonscan.com/tx/';

// Then customize the component or use window.open in callbacks
```

## Best Practices

1. **Always connect user first** - Transaction requires active connection
2. **Validate inputs** - Check recipient address and amount before showing dialog
3. **Handle errors gracefully** - Provide user feedback on errors
4. **Test gasless mode** - Verify paymaster is configured correctly
5. **Monitor transaction status** - Use callbacks to track progress in your app state
6. **Provide clear instructions** - Tell users about USSD confirmation upfront

## Troubleshooting

### Dialog doesn't open
- Ensure user is connected (use `useIsConnected` hook)
- Check transaction object is valid
- Verify SDK is initialized with `CryptoMomoProvider`

### Status not updating
- Check network connection
- Verify API endpoints are accessible
- Check browser console for errors
- Ensure transaction ID is valid

### Code expires too quickly
- Default is 5 minutes (configurable on backend)
- User must confirm via USSD within time limit
- Expired codes require new transaction

### Gasless transactions fail
- Verify paymaster is configured
- Check gas limits are set correctly
- Ensure paymaster has sufficient funds
- Test with regular transaction first
