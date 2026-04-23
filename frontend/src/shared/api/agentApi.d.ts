import { Agent, CreateAgentPayload } from '../types/agent';
export declare const agentApi: {
    getAgents: () => Promise<Agent[]>;
    getAgent: (id: string) => Promise<Agent>;
    createAgent: (payload: CreateAgentPayload) => Promise<Agent>;
    boostAgent: (id: string) => Promise<Agent>;
    buyToken: (agentId: string, amount: number) => Promise<Agent>;
    sellToken: (agentId: string, amount: number) => Promise<Agent>;
    getBattleLogs: () => Promise<BattleLog[]>;
};
interface BattleLog {
    id: string;
    agentId: string;
    agentName: string;
    reason: string;
    scoreDelta: number;
    timestamp: number;
}
export default agentApi;
//# sourceMappingURL=agentApi.d.ts.map