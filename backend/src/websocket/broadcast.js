"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerClient = registerClient;
exports.broadcastUpdate = broadcastUpdate;
exports.getClientCount = getClientCount;
// backend/src/websocket/broadcaster.ts
const ws_1 = require("ws");
const clients = new Set();
/**
 * Register new WebSocket client
 */
function registerClient(ws) {
    clients.add(ws);
    ws.on('close', () => clients.delete(ws));
    ws.on('error', () => clients.delete(ws));
}
/**
 * Broadcast message to all connected clients
 */
function broadcastUpdate(message) {
    const payload = JSON.stringify(message);
    clients.forEach(client => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(payload);
        }
    });
}
/**
 * Get connected client count
 */
function getClientCount() {
    return clients.size;
}
//# sourceMappingURL=broadcast.js.map