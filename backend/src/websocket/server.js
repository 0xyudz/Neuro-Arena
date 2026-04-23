"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
exports.broadcastUpdate = broadcastUpdate;
const ws_1 = require("ws");
const broadcast_1 = require("./broadcast");
const shared_1 = require("@agent-arena/shared");
const clients = new Set();
function setupWebSocket(wss) {
    wss.on('connection', (ws) => {
        console.log('🔌 New WebSocket client connected');
        (0, broadcast_1.registerClient)(ws);
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
function broadcastUpdate(message) {
    const data = JSON.stringify(message);
    for (const client of clients) {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(data);
        }
    }
}
//# sourceMappingURL=server.js.map