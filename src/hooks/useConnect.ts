import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CryptoMomoClient } from '../core/client';
import { useConfig, useSetConnection } from '../core/store';
import {
  ConnectionRequestInput,
  ConnectionInfo,
  OTPVerificationInput,
  UseConnectOptions,
  CryptoMomoError,
  ValidationError,
} from '../types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

/**
 * Hook for connecting users to your DApp via phone number + OTP
 * Similar to useConnect from WalletConnect/ThirdWeb
 */
export function useConnect(options?: UseConnectOptions) {
  const config = useConfig();
  const setConnection = useSetConnection();

  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Validate configuration
  const validateConfig = useCallback(() => {
    if (!config) {
      throw new ValidationError('SDK not initialized. Please initialize with CryptoMomoProvider.');
    }
    return new CryptoMomoClient(config);
  }, [config]);

  // Request connection (send OTP)
  const requestConnectionMutation = useMutation({
    mutationFn: async (phoneNum: string): Promise<ConnectionInfo> => {
      const client = validateConfig();
      const request: ConnectionRequestInput = {
        phoneNumber: phoneNum,
      };
      return await client.requestConnection(phoneNum);
    },
    onSuccess: (response) => {
      setConnectionId(response.id);
      setIsOTPSent(true);
      setPhoneNumber(response.phoneNumber);
      setNeedsRegistration(false);
      options?.onSuccess?.(response);
    },
    onError: (error: CryptoMomoError) => {
      // Handle USER_NOT_FOUND error
      if (error.message.includes('USER_NOT_FOUND') || error.message.includes('not found')) {
        setNeedsRegistration(true);
      }
      options?.onError?.(error);
    },
  });

  // Register account
  const registerAccountMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phoneNumber: string }) => {
      const client = validateConfig();
      return await client.registerAccount(data.firstName, data.lastName, data.phoneNumber);
    },
    onSuccess: (response) => {
      setRegistrationSuccess(true);
      setNeedsRegistration(false);
      options?.onSuccess?.(response as any);
    },
    onError: (error: CryptoMomoError) => {
      options?.onError?.(error);
    },
  });

  // Verify OTP
  const verifyOTPMutation = useMutation({
    mutationFn: async (otp: string): Promise<ConnectionInfo> => {
      if (!connectionId) {
        throw new ValidationError('No active connection to verify');
      }

      const client = validateConfig();
      const request: OTPVerificationInput = {
        connectionId,
        otp,
      };
      return await client.verifyOTP(connectionId, otp);
    },
    onSuccess: (response) => {
      if (response.status === 'approved') {
        setConnection(response);
        setConnectionId(null);
        setIsOTPSent(false);
        setPhoneNumber('');
      }
    },
    onError: (error: CryptoMomoError) => {
      options?.onError?.(error);
    },
  });

  // Connect function - initiates connection with phone number
  const connect = useCallback(
    async (phoneNum: string) => {
      if (!phoneNum) {
        throw new ValidationError(ERROR_MESSAGES.INVALID_PHONE);
      }

      return requestConnectionMutation.mutateAsync(phoneNum);
    },
    [requestConnectionMutation]
  );

  // Verify OTP function
  const verifyOTP = useCallback(
    async (otp: string) => {
      if (!otp) {
        throw new ValidationError(ERROR_MESSAGES.INVALID_OTP);
      }

      if (!connectionId) {
        throw new ValidationError('No active connection to verify');
      }

      return verifyOTPMutation.mutateAsync(otp);
    },
    [connectionId, verifyOTPMutation]
  );

  // Register function
  const register = useCallback(
    async (firstName: string, lastName: string, phoneNum: string) => {
      if (!firstName || !lastName || !phoneNum) {
        throw new ValidationError('First name, last name, and phone number are required');
      }

      return registerAccountMutation.mutateAsync({ firstName, lastName, phoneNumber: phoneNum });
    },
    [registerAccountMutation]
  );

  // Reset connection state
  const reset = useCallback(() => {
    setConnectionId(null);
    setIsOTPSent(false);
    setPhoneNumber('');
    setNeedsRegistration(false);
    setRegistrationSuccess(false);
    requestConnectionMutation.reset();
    registerAccountMutation.reset();
    verifyOTPMutation.reset();
  }, [requestConnectionMutation, registerAccountMutation, verifyOTPMutation]);

  return {
    // Functions
    connect,
    register,
    verifyOTP,
    reset,

    // State
    isConnecting: requestConnectionMutation.isPending,
    isRegistering: registerAccountMutation.isPending,
    isVerifying: verifyOTPMutation.isPending,
    isOTPSent,
    connectionId,
    phoneNumber,
    needsRegistration,
    registrationSuccess,

    // Errors
    connectError: requestConnectionMutation.error,
    registerError: registerAccountMutation.error,
    verifyError: verifyOTPMutation.error,

    // Status
    isSuccess: verifyOTPMutation.isSuccess && verifyOTPMutation.data?.status === 'approved',
    isError: requestConnectionMutation.isError || registerAccountMutation.isError || verifyOTPMutation.isError,
  };
}
