declare class AgentEngine {
    private round;
    private running;
    private intervalId;
    private readonly TICK_MS;
    start(): void;
    stop(): void;
    isRunning(): boolean;
    private tick;
}
export declare const agentEngine: AgentEngine;
export {};
//# sourceMappingURL=engine.d.ts.map