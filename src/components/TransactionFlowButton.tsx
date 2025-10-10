import React, { useState } from 'react';
import { Button } from './ui/button';
import { TransactionFlowDialog, TransactionFlowDialogProps } from './TransactionFlowDialog';
import { Send, Zap } from 'lucide-react';
import { CryptoMomoWrapper } from './ui/wrapper';

export interface TransactionFlowButtonProps
  extends Omit<TransactionFlowDialogProps, 'open' | 'onOpenChange'> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
}

/**
 * TransactionFlowButton - A button that opens a full transaction flow dialog
 *
 * Features:
 * - Transaction preview with details
 * - Confirmation code display with countdown
 * - Real-time transaction status tracking
 * - Success/error states with transaction details
 *
 * @example
 * ```tsx
 * <TransactionFlowButton
 *   transaction={{
 *     to: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *     value: '1000000000000000000', // 1 ETH in wei
 *   }}
 *   gasless={true}
 *   onSuccess={(response) => console.log('Transaction complete!', response)}
 * >
 *   Send 1 ETH
 * </TransactionFlowButton>
 * ```
 */
export function TransactionFlowButton({
  children,
  className,
  disabled,
  variant = 'default',
  size = 'default',
  showIcon = true,
  transaction,
  gasless,
  onSuccess,
  onError,
}: TransactionFlowButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <CryptoMomoWrapper>
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {showIcon && (
          gasless ? (
            <Zap className="mr-2 h-4 w-4" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )
        )}
        {children || (gasless ? 'Send (Gasless)' : 'Send Transaction')}
      </Button>

      <TransactionFlowDialog
        open={open}
        onOpenChange={setOpen}
        transaction={transaction}
        gasless={gasless}
        onSuccess={onSuccess}
        onError={onError}
      />
    </CryptoMomoWrapper>
  );
}
