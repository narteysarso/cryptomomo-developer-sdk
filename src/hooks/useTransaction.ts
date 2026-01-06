import { useCallback, useEffect, useState } from 'react';
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
import { wsService } from '../core/websocket';
import { WebSocketEvent, TransactionEventPayload } from '../types/websocket.types';

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
 * Hook for getting transaction status (uses WebSocket for real-time updates)
 */
export function useTransactionStatus(transactionId?: string) {
  const config = useConfig();
  const [liveStatus, setLiveStatus] = useState<TransactionResponse | null>(null);

  // Initial fetch
  const query = useQuery({
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
    // Only fetch once, WebSocket will handle updates
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // Listen for WebSocket events
  useEffect(() => {
    if (!transactionId) return;

    // Join transaction room for targeted updates
    wsService.joinTransactionRoom(transactionId);

    // Handle real-time transaction status updates
    const handleTransactionUpdate = (payload: TransactionEventPayload) => {
      if (payload.transactionId === transactionId) {
        // Update with new status data
        setLiveStatus((prev) => ({
          ...prev,
          ...(prev as any),
          status: payload.status,
          updatedAt: payload.timestamp,
          // Add transaction-specific fields from payload if available
          ...(payload as any),
        }));
      }
    };

    // Subscribe to all transaction events
    const unsubConfirmed = wsService.on(WebSocketEvent.TRANSACTION_CONFIRMED, handleTransactionUpdate);
    const unsubExecuting = wsService.on(WebSocketEvent.TRANSACTION_EXECUTING, handleTransactionUpdate);
    const unsubCompleted = wsService.on(WebSocketEvent.TRANSACTION_COMPLETED, handleTransactionUpdate);
    const unsubFailed = wsService.on(WebSocketEvent.TRANSACTION_FAILED, handleTransactionUpdate);
    const unsubExpired = wsService.on(WebSocketEvent.TRANSACTION_EXPIRED, handleTransactionUpdate);

    // Cleanup
    return () => {
      wsService.leaveTransactionRoom(transactionId);
      unsubConfirmed();
      unsubExecuting();
      unsubCompleted();
      unsubFailed();
      unsubExpired();
    };
  }, [transactionId]);

  // Return live status if available, otherwise fall back to query data
  return {
    ...query,
    data: liveStatus || query.data,
  };
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
