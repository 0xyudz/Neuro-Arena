import { AgentLogEntry } from '../../types/agent';
declare function get(limit?: number): AgentLogEntry[];
export declare const AgentLog: {
    add(entry: Omit<AgentLogEntry, "id">): AgentLogEntry;
    get: typeof get;
    getAll(): AgentLogEntry[];
    getByAgent(agentId: string, limit?: number): AgentLogEntry[];
    subscribe(callback: (entries: AgentLogEntry[]) => void): () => void;
    clear(): void;
    count(): number;
};
export {};
//# sourceMappingURL=log.d.ts.map