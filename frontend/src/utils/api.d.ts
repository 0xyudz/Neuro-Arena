import { Agent, RewardPool, StakeRequest } from '../types';
export declare const api: {
    getAgents(): Promise<Agent[]>;
    createAgent(agent: Partial<Agent>): Promise<any>;
    getUserBalance(userId: string): Promise<number>;
    getRewardPool(): Promise<RewardPool>;
    stake(request: StakeRequest): Promise<any>;
};
//# sourceMappingURL=api.d.ts.map