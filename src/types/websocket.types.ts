/**
 * WebSocket Event Types for SDK
 * Must match server-side event definitions
 */

// ============================================================================
// Event Names (must match server)
// ============================================================================

export enum WebSocketEvent {
  // Connection Events
  CONNECTION_REQUESTED = 'connection:requested',
  CONNECTION_APPROVED = 'connection:approved',
  CONNECTION_REJECTED = 'connection:rejected',
  CONNECTION_REVOKED = 'connection:revoked',
  CONNECTION_EXPIRED = 'connection:expired',

  // Transaction Events
  TRANSACTION_CREATED = 'transaction:created',
  TRANSACTION_CONFIRMED = 'transaction:confirmed',
  TRANSACTION_EXECUTING = 'transaction:executing',
  TRANSACTION_COMPLETED = 'transaction:completed',
  TRANSACTION_FAILED = 'transaction:failed',
  TRANSACTION_EXPIRED = 'transaction:expired',

  // System Events
  ERROR = 'error',
  AUTHENTICATED = 'authenticated',
  DISCONNECT = 'disconnect',
}

// ============================================================================
// Event Payloads
// ============================================================================

export interface ConnectionEventPayload {
  connectionId: string;
  dappId: string;
  phoneNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'revoked';
  timestamp: Date;
}

export interface TransactionEventPayload {
  transactionId: string;
  connectionId: string;
  status: 'awaiting_confirmation' | 'confirmed' | 'executing' | 'completed' | 'failed' | 'expired';
  timestamp: Date;
}

export interface TransactionCompletedPayload extends TransactionEventPayload {
  txHash: string;
  blockNumber?: number;
  blockHash?: string;
  gasUsed?: string;
  effectiveGasPrice?: string;
}

export interface TransactionFailedPayload extends TransactionEventPayload {
  error: string;
  errorCode?: string;
}

export interface WebSocketAuthResponse {
  success: boolean;
  userId?: string;
  dappId?: string;
  error?: string;
}

export interface WebSocketError {
  code: string;
  message: string;
  timestamp: Date;
}
