// backend/src/websocket/broadcaster.ts
import { WebSocket } from 'ws';

const clients = new Set<WebSocket>();

/**
 * Register new WebSocket client
 */
export function registerClient(ws: WebSocket) {
  clients.add(ws);
  
  ws.on('close', () => clients.delete(ws));
  ws.on('error', () => clients.delete(ws));
}

/**
 * Broadcast message to all connected clients
 */
export function broadcastUpdate(message: any) {
  const payload = JSON.stringify(message);
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

/**
 * Get connected client count
 */
export function getClientCount(): number {
  return clients.size;
}