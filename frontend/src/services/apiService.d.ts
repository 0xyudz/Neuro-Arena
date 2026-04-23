import { Agent, CreateAgentRequest, CreateAgentResponse, LeaderboardEntry } from '@agent-arena/shared';
export declare const apiService: {
    getAgents(): Promise<Agent[]>;
    getAgent(id: string): Promise<Agent>;
    createAgent(data: CreateAgentRequest): Promise<CreateAgentResponse>;
    getLeaderboard(): Promise<LeaderboardEntry[]>;
    simulate(): Promise<void>;
};
//# sourceMappingURL=apiService.d.ts.map