export declare const rewardService: {
    /**
     * Distribute rewards to stakers when agent wins a battle
     * rewardPool = 1% of agent's current market cap (configurable)
     */
    distributeBattleReward(agentId: string, rewardPool?: number): Promise<{
        distributed: number;
        recipients: number;
        rewards?: never;
    } | {
        distributed: number;
        recipients: number;
        rewards: {
            userWallet: string;
            amount: number;
        }[];
    }>;
    /**
     * Get rewards for a user
     */
    getUserRewards(userWallet: string): Promise<({
        agent: {
            id: string;
            tokenSymbol: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userWallet: string;
        amount: number;
        agentId: string;
        reason: string | null;
        claimed: boolean;
        claimedAt: Date | null;
    })[]>;
    /**
     * Get rewards for a user (includes claimed status)
     */
    getUserRewards(userWallet: string): Promise<{
        totalRewards: number;
        unclaimed: number;
        rewards: ({
            agent: {
                id: string;
                tokenSymbol: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userWallet: string;
            amount: number;
            agentId: string;
            reason: string | null;
            claimed: boolean;
            claimedAt: Date | null;
        })[];
    }>;
    /**
     * Get total rewards earned by user
     */
    getUserTotalRewards(userWallet: string): Promise<number>;
    /**
     * Claim all unclaimed rewards for a user
     */
    claimRewards(userWallet: string): Promise<{
        success: boolean;
        totalClaimed: number;
        count: number;
    }>;
    /**
     * Get user stake & rewards for a specific agent
     */
    getUserAgentStats(userWallet: string, agentId: string): Promise<{
        totalStaked: number;
        totalRewards: number;
        unclaimedRewards: number;
    }>;
};
export default rewardService;
//# sourceMappingURL=rewardService.d.ts.map