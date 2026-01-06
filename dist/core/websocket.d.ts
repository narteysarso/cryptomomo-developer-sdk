/**
 * WebSocket Service for real-time updates
 * Connects to dev2 WebSocket server and listens for connection/transaction events
 */
import { WebSocketEvent } from '../types/websocket.types';
type EventCallback<T = any> = (payload: T) => void;
declare class WebSocketService {
    private socket;
    private baseUrl;
    private sessionToken;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private isConnecting;
    private eventListeners;
    /**
     * Initialize WebSocket connection
     */
    connect(baseUrl: string, sessionToken?: string): void;
    /**
     * Setup Socket.IO event handlers
     */
    private setupEventHandlers;
    /**
     * Subscribe to an event
     */
    on<T = any>(event: WebSocketEvent | string, callback: EventCallback<T>): () => void;
    /**
     * Unsubscribe from an event
     */
    off(event: WebSocketEvent | string, callback: EventCallback): void;
    /**
     * Notify all listeners for an event
     */
    private notifyListeners;
    /**
     * Join a specific room (for targeted updates)
     */
    joinConnectionRoom(connectionId: string): void;
    /**
     * Join transaction room
     */
    joinTransactionRoom(transactionId: string): void;
    /**
     * Leave connection room
     */
    leaveConnectionRoom(connectionId: string): void;
    /**
     * Leave transaction room
     */
    leaveTransactionRoom(transactionId: string): void;
    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void;
    /**
     * Check if connected
     */
    isConnected(): boolean;
    /**
     * Update session token (called after successful authentication)
     */
    updateSessionToken(token: string): void;
}
export declare const wsService: WebSocketService;
export {};
//# sourceMappingURL=websocket.d.ts.map