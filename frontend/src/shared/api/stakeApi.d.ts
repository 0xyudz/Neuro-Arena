export interface StakePayload {
    userId: string;
    agentId: string;
    amount: number;
}
export interface StakeResponse {
    success: boolean;
    stake: {
        id: string;
        userId: string;
        agentId: string;
        amount: number;
        createdAt: string;
    };
    agent: {
        id: string;
        totalStake: number;
    };
    userBalance: number;
}
export declare const stakeApi: {
    stake: (payload: StakePayload) => Promise<StakeResponse>;
    getUserBalance: (userId: string) => Promise<number>;
    getAgentStakes: (agentId: string) => Promise<Array<{
        userId: string;
        amount: number;
    }>>;
};
export default stakeApi;
//# sourceMappingURL=stakeApi.d.ts.map