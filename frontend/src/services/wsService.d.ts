import { WsMessage } from '@agent-arena/shared';
declare class WebSocketService {
    private ws;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectDelay;
    connect(onMessage: (message: WsMessage) => void): void;
    private attemptReconnect;
    disconnect(): void;
    send(message: any): void;
}
export declare const wsService: WebSocketService;
export {};
//# sourceMappingURL=wsService.d.ts.map