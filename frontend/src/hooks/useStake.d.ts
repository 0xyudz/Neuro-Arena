export interface StakeResult {
    success: boolean;
    stake?: any;
    totalStake?: number;
    error?: string;
}
export declare function useStake(userWallet: string | null): {
    stake: (agentId: string, amount: number) => Promise<StakeResult>;
    getAgentStakes: (agentId: string) => Promise<any>;
    getUserRewards: () => Promise<any>;
    loading: boolean;
};
export default useStake;
//# sourceMappingURL=useStake.d.ts.map