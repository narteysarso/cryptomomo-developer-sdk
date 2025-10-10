import { TransactionRequest, TransactionResponse, CryptoMomoError } from '../types';
export interface TransactionFlowDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Omit<TransactionRequest, 'connectionId'>;
    gasless?: boolean;
    onSuccess?: (response: TransactionResponse) => void;
    onError?: (error: CryptoMomoError) => void;
}
export declare function TransactionFlowDialog({ open, onOpenChange, transaction, gasless, onSuccess, onError, }: TransactionFlowDialogProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TransactionFlowDialog.d.ts.map