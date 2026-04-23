import { WebSocket } from 'ws';
/**
 * Register new WebSocket client
 */
export declare function registerClient(ws: WebSocket): void;
/**
 * Broadcast message to all connected clients
 */
export declare function broadcastUpdate(message: any): void;
/**
 * Get connected client count
 */
export declare function getClientCount(): number;
//# sourceMappingURL=broadcast.d.ts.map