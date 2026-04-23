import { Agent } from '../../types/agent';
declare function getAgents(): Agent[];
export declare const AgentRegistry: {
    createAgent(input: Omit<Agent, "id" | "createdAt" | "updatedAt" | "runtime" | "financial">): Agent;
    updateAgent(id: string, updates: Partial<Agent>): Agent | undefined;
    getAgents: typeof getAgents;
    getAgentById(id: string): Agent | undefined;
    subscribe(fn: (agents: Agent[]) => void): () => boolean;
};
export {};
//# sourceMappingURL=registry.d.ts.map