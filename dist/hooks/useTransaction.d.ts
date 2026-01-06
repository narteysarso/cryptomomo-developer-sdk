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
 * Hook for getting transaction status (uses WebSocket for real-time updates)
 */
export declare function useTransactionStatus(transactionId?: string): {
    data: TransactionResponse | undefined;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: true;
    isSuccess: false;
    isPlaceholderData: false;
    status: "error";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<TransactionResponse, Error>>;
    fetchStatus: import("@tanstack/react-query").FetchStatus;
    promise: Promise<TransactionResponse>;
} | {
    data: TransactionResponse | undefined;
    error: null;
    isError: false;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: false;
    status: "success";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<TransactionResponse, Error>>;
    fetchStatus: import("@tanstack/react-query").FetchStatus;
    promise: Promise<TransactionResponse>;
} | {
    data: TransactionResponse | undefined;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: true;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: "error";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<TransactionResponse, Error>>;
    fetchStatus: import("@tanstack/react-query").FetchStatus;
    promise: Promise<TransactionResponse>;
} | {
    data: TransactionResponse | undefined;
    error: null;
    isError: false;
    isPending: true;
    isLoading: true;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: "pending";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<TransactionResponse, Error>>;
    fetchStatus: import("@tanstack/react-query").FetchStatus;
    promise: Promise<TransactionResponse>;
} | {
    data: TransactionResponse | undefined;
    error: null;
    isError: false;
    isPending: true;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: "pending";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<TransactionResponse, Error>>;
    fetchStatus: import("@tanstack/react-query").FetchStatus;
    promise: Promise<TransactionResponse>;
} | {
    data: TransactionResponse | undefined;
    isError: false;
    error: null;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: true;
    status: "success";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: (options?: import("@tanstack/react-query").RefetchOptions) => Promise<import("@tanstack/react-query").QueryObserverResult<TransactionResponse, Error>>;
    fetchStatus: import("@tanstack/react-query").FetchStatus;
    promise: Promise<TransactionResponse>;
};
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