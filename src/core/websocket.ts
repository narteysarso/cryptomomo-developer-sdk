/**
 * WebSocket Service for real-time updates
 * Connects to dev2 WebSocket server and listens for connection/transaction events
 */

import { io, Socket } from 'socket.io-client';
import {
  WebSocketEvent,
  ConnectionEventPayload,
  TransactionEventPayload,
  WebSocketAuthResponse,
  WebSocketError,
} from '../types/websocket.types';

type EventCallback<T = any> = (payload: T) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private baseUrl: string = '';
  private sessionToken: string | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private isConnecting: boolean = false;
  private eventListeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Initialize WebSocket connection
   */
  public connect(baseUrl: string, sessionToken?: string): void {
    if (this.socket?.connected) {
      console.log('[WebSocket] Already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('[WebSocket] Connection already in progress');
      return;
    }

    this.isConnecting = true;
    this.baseUrl = baseUrl;
    this.sessionToken = sessionToken || null;

    // Extract base URL (remove /api/v1 suffix if present)
    const wsUrl = baseUrl.replace(/\/api\/v\d+$/, '');

    console.log('[WebSocket] Connecting to:', wsUrl);

    this.socket = io(wsUrl, {
      path: '/ws',
      auth: {
        token: this.sessionToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupEventHandlers();
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected successfully');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      this.isConnecting = false;
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WebSocket] Max reconnection attempts reached');
      }
    });

    // Authentication response
    this.socket.on(WebSocketEvent.AUTHENTICATED, (response: WebSocketAuthResponse) => {
      console.log('[WebSocket] Authenticated:', response);
      this.notifyListeners(WebSocketEvent.AUTHENTICATED, response);
    });

    // Connection events
    this.socket.on(WebSocketEvent.CONNECTION_REQUESTED, (payload: ConnectionEventPayload) => {
      console.log('[WebSocket] Connection requested:', payload);
      this.notifyListeners(WebSocketEvent.CONNECTION_REQUESTED, payload);
    });

    this.socket.on(WebSocketEvent.CONNECTION_APPROVED, (payload: ConnectionEventPayload) => {
      console.log('[WebSocket] Connection approved:', payload);
      this.notifyListeners(WebSocketEvent.CONNECTION_APPROVED, payload);
    });

    this.socket.on(WebSocketEvent.CONNECTION_REJECTED, (payload: ConnectionEventPayload) => {
      console.log('[WebSocket] Connection rejected:', payload);
      this.notifyListeners(WebSocketEvent.CONNECTION_REJECTED, payload);
    });

    this.socket.on(WebSocketEvent.CONNECTION_REVOKED, (payload: ConnectionEventPayload) => {
      console.log('[WebSocket] Connection revoked:', payload);
      this.notifyListeners(WebSocketEvent.CONNECTION_REVOKED, payload);
    });

    this.socket.on(WebSocketEvent.CONNECTION_EXPIRED, (payload: ConnectionEventPayload) => {
      console.log('[WebSocket] Connection expired:', payload);
      this.notifyListeners(WebSocketEvent.CONNECTION_EXPIRED, payload);
    });

    // Transaction events
    this.socket.on(WebSocketEvent.TRANSACTION_CREATED, (payload: TransactionEventPayload) => {
      console.log('[WebSocket] Transaction created:', payload);
      this.notifyListeners(WebSocketEvent.TRANSACTION_CREATED, payload);
    });

    this.socket.on(WebSocketEvent.TRANSACTION_CONFIRMED, (payload: TransactionEventPayload) => {
      console.log('[WebSocket] Transaction confirmed:', payload);
      this.notifyListeners(WebSocketEvent.TRANSACTION_CONFIRMED, payload);
    });

    this.socket.on(WebSocketEvent.TRANSACTION_EXECUTING, (payload: TransactionEventPayload) => {
      console.log('[WebSocket] Transaction executing:', payload);
      this.notifyListeners(WebSocketEvent.TRANSACTION_EXECUTING, payload);
    });

    this.socket.on(WebSocketEvent.TRANSACTION_COMPLETED, (payload: TransactionEventPayload) => {
      console.log('[WebSocket] Transaction completed:', payload);
      this.notifyListeners(WebSocketEvent.TRANSACTION_COMPLETED, payload);
    });

    this.socket.on(WebSocketEvent.TRANSACTION_FAILED, (payload: TransactionEventPayload) => {
      console.log('[WebSocket] Transaction failed:', payload);
      this.notifyListeners(WebSocketEvent.TRANSACTION_FAILED, payload);
    });

    this.socket.on(WebSocketEvent.TRANSACTION_EXPIRED, (payload: TransactionEventPayload) => {
      console.log('[WebSocket] Transaction expired:', payload);
      this.notifyListeners(WebSocketEvent.TRANSACTION_EXPIRED, payload);
    });

    // Error handling
    this.socket.on(WebSocketEvent.ERROR, (error: WebSocketError) => {
      console.error('[WebSocket] Error:', error);
      this.notifyListeners(WebSocketEvent.ERROR, error);
    });
  }

  /**
   * Subscribe to an event
   */
  public on<T = any>(event: WebSocketEvent | string, callback: EventCallback<T>): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }

    this.eventListeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Unsubscribe from an event
   */
  public off(event: WebSocketEvent | string, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  /**
   * Notify all listeners for an event
   */
  private notifyListeners(event: string, payload: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[WebSocket] Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Join a specific room (for targeted updates)
   */
  public joinConnectionRoom(connectionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-connection', connectionId);
    }
  }

  /**
   * Join transaction room
   */
  public joinTransactionRoom(transactionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-transaction', transactionId);
    }
  }

  /**
   * Leave connection room
   */
  public leaveConnectionRoom(connectionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-connection', connectionId);
    }
  }

  /**
   * Leave transaction room
   */
  public leaveTransactionRoom(transactionId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-transaction', transactionId);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      console.log('[WebSocket] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.sessionToken = null;
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.eventListeners.clear();
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Update session token (called after successful authentication)
   */
  public updateSessionToken(token: string): void {
    this.sessionToken = token;

    // Reconnect with new token
    if (this.socket && this.baseUrl) {
      this.disconnect();
      this.connect(this.baseUrl, token);
    }
  }
}

// Export singleton instance
export const wsService = new WebSocketService();
