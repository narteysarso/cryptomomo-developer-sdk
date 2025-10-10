import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CryptoMomoClient } from '../core/client';
import { useConfig, useCurrentConnection } from '../core/store';
import {
  TransactionRequest,
  TransactionResponse,
  GaslessTransactionRequest,
  BalanceResponse,
  UseTransactionOptions,
  CryptoMomoError,
  ValidationError,
  AuthenticationError,
} from '../types';
import { ERROR_MESSAGES } from '../constants';

/**
 * Hook for sending transactions
 * Works with approved connections
 */
export function useTransaction(options?: UseTransactionOptions) {
  const config = useConfig();
  const currentConnection = useCurrentConnection();

  // Validate configuration and connection
  const validateAuth = useCallback(() => {
    if (!config) {
      throw new ValidationError('SDK not initialized. Please initialize with CryptoMomoProvider.');
    }
    if (!currentConnection || currentConnection.status !== 'approved') {
      throw new AuthenticationError('No active connection. Please connect first.');
    }
    return new CryptoMomoClient(config);
  }, [config, currentConnection]);

  // Execute regular transaction
  const executeMutation = useMutation({
    mutationFn: async (transaction: Omit<TransactionRequest, 'connectionId'>): Promise<TransactionResponse> => {
      const client = validateAuth();
      const fullRequest: TransactionRequest = {
        ...transaction,
        connectionId: currentConnection!.id,
      };
      return await client.sendTransaction(fullRequest);
    },
    onSuccess: (response) => {
      options?.onSuccess?.(response);
    },
    onError: (error: CryptoMomoError) => {
      options?.onError?.(error);
    },
  });

  // Execute gasless transaction
  const executeGaslessMutation = useMutation({
    mutationFn: async (
      transaction: Omit<GaslessTransactionRequest, 'connectionId'>
    ): Promise<TransactionResponse> => {
      const client = validateAuth();
      const fullRequest: GaslessTransactionRequest = {
        ...transaction,
        connectionId: currentConnection!.id,
      };
      return await client.sendGaslessTransaction(fullRequest);
    },
    onSuccess: (response) => {
      options?.onSuccess?.(response);
    },
    onError: (error: CryptoMomoError) => {
      options?.onError?.(error);
    },
  });

  // Execute transaction (choose gasless or regular based on options)
  const execute = useCallback(
    async (transaction: Omit<TransactionRequest, 'connectionId'>) => {
      if (options?.gasless) {
        // Convert to gasless transaction
        const gaslessTransaction: Omit<GaslessTransactionRequest, 'connectionId'> = {
          ...transaction,
          paymasterAddress: '0x0000000000000000000000000000000000000000', // TODO: Get from config
          sponsorType: 'full',
        };
        return executeGaslessMutation.mutateAsync(gaslessTransaction);
      } else {
        return executeMutation.mutateAsync(transaction);
      }
    },
    [options?.gasless, executeMutation, executeGaslessMutation]
  );

  return {
    // Functions
    execute,
    executeRegular: executeMutation.mutateAsync,
    executeGasless: executeGaslessMutation.mutateAsync,

    // State
    isExecuting: executeMutation.isPending || executeGaslessMutation.isPending,
    isSuccess: executeMutation.isSuccess || executeGaslessMutation.isSuccess,
    isError: executeMutation.isError || executeGaslessMutation.isError,

    // Errors
    error: executeMutation.error || executeGaslessMutation.error,

    // Data
    data: executeMutation.data || executeGaslessMutation.data,

    // Reset
    reset: () => {
      executeMutation.reset();
      executeGaslessMutation.reset();
    },
  };
}

/**
 * Hook for getting transaction status (auto-polls until completed/failed)
 */
export function useTransactionStatus(transactionId?: string) {
  const config = useConfig();

  return useQuery({
    queryKey: ['transaction-status', transactionId],
    queryFn: async () => {
      if (!config) {
        throw new ValidationError('SDK not initialized');
      }
      if (!transactionId) {
        throw new ValidationError('Transaction ID is required');
      }
      const client = new CryptoMomoClient(config);
      return await client.getTransactionStatus(transactionId);
    },
    enabled: !!config && !!transactionId,
    refetchInterval: (query) => {
      // Stop refetching if transaction is completed, failed, or expired
      const data = query.state.data;
      if (data?.status === 'completed' || data?.status === 'failed' || data?.status === 'expired') {
        return false;
      }
      // Poll every 3 seconds for active transactions
      return 3000;
    },
  });
}

/**
 * Hook for getting transaction history
 */
export function useTransactionHistory(filters?: {
  limit?: number;
  offset?: number;
  status?: 'pending' | 'confirmed' | 'failed';
}) {
  const config = useConfig();
  const currentConnection = useCurrentConnection();

  return useQuery({
    queryKey: ['transaction-history', currentConnection?.id, filters],
    queryFn: async () => {
      if (!config) {
        throw new ValidationError('SDK not initialized');
      }
      if (!currentConnection) {
        throw new AuthenticationError('No active connection');
      }
      const client = new CryptoMomoClient(config);
      return await client.getTransactionHistory({
        connectionId: currentConnection.id,
        ...filters,
      });
    },
    enabled: !!config && !!currentConnection,
  });
}

/**
 * Hook for getting user balance
 */
export function useBalance(tokenAddress?: string, chainId?: number) {
  const config = useConfig();
  const currentConnection = useCurrentConnection();

  return useQuery({
    queryKey: ['balance', currentConnection?.id, tokenAddress, chainId],
    queryFn: async () => {
      if (!config) {
        throw new ValidationError('SDK not initialized');
      }
      if (!currentConnection) {
        throw new AuthenticationError('No active connection');
      }
      const client = new CryptoMomoClient(config);
      return await client.getBalance(currentConnection.id, tokenAddress, chainId);
    },
    enabled: !!config && !!currentConnection,
  });
}
