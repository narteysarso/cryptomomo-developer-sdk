import { TransactionRequest, TransactionResponse, GaslessTransactionRequest, BalanceResponse, UseTransactionOptions, CryptoMomoError } from '../types';
/**
 * Hook for sending transactions
 * Works with approved connections
 */
export declare function useTransaction(options?: UseTransactionOptions): {
    execute: (transaction: Omit<TransactionRequest, "connectionId">) => Promise<TransactionResponse>;
    executeRegular: import("@tanstack/react-query").UseMutateAsyncFunction<TransactionResponse, CryptoMomoError, Omit<TransactionRequest, "connectionId">, unknown>;
    executeGasless: import("@tanstack/react-query").UseMutateAsyncFunction<TransactionResponse, CryptoMomoError, Omit<GaslessTransactionRequest, "connectionId">, unknown>;
    isExecuting: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: CryptoMomoError | null;
    data: TransactionResponse | undefined;
    reset: () => void;
};
/**
 * Hook for getting transaction status (auto-polls until completed/failed)
 */
export declare function useTransactionStatus(transactionId?: string): import("@tanstack/react-query").UseQueryResult<TransactionResponse, Error>;
/**
 * Hook for getting transaction history
 */
export declare function useTransactionHistory(filters?: {
    limit?: number;
    offset?: number;
    status?: 'pending' | 'confirmed' | 'failed';
}): import("@tanstack/react-query").UseQueryResult<TransactionResponse[], Error>;
/**
 * Hook for getting user balance
 */
export declare function useBalance(tokenAddress?: string, chainId?: number): import("@tanstack/react-query").UseQueryResult<BalanceResponse, Error>;
//# sourceMappingURL=useTransaction.d.ts.map