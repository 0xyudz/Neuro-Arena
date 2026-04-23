import { WsMessage } from '@agent-arena/shared';
class WebSocketService {
    ws = null;
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;
    reconnectDelay = 1000;
    connect(onMessage) {
        const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3002';
        this.ws = new WebSocket(WS_URL);
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
        };
        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                onMessage(message);
            }
            catch (err) {
                console.error('Failed to parse WebSocket message:', err);
            }
        };
        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.attemptReconnect(onMessage);
        };
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
    attemptReconnect(onMessage) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * this.reconnectAttempts;
            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`);
            setTimeout(() => this.connect(onMessage), delay);
        }
    }
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
    send(message) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }
}
export const wsService = new WebSocketService();
//# sourceMappingURL=wsService.js.map