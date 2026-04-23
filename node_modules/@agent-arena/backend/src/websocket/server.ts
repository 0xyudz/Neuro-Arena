import { WebSocketServer, WebSocket } from 'ws';
import { registerClient, broadcastUpdate } from './broadcast';

import { WsMessage } from '@agent-arena/shared';

const clients = new Set<WebSocket>();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws) => {
    
    console.log('🔌 New WebSocket client connected');
    registerClient(ws);
    // clients.add(ws);
    
    ws.on('close', () => {
      console.log('🔌 Client disconnected');
      clients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection_established',
      payload: { timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString(),
    }));
  });
}

export function broadcastUpdate(message: WsMessage) {
  const data = JSON.stringify(message);
  
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}