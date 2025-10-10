import React from 'react';
import { TransactionFlowDialogProps } from './TransactionFlowDialog';
export interface TransactionFlowButtonProps extends Omit<TransactionFlowDialogProps, 'open' | 'onOpenChange'> {
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
export declare function TransactionFlowButton({ children, className, disabled, variant, size, showIcon, transaction, gasless, onSuccess, onError, }: TransactionFlowButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TransactionFlowButton.d.ts.map