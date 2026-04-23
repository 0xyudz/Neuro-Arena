export declare const stakeService: {
    /**
     * Stake tokens on an agent
     */
    stake(userWallet: string, agentId: string, amount: number): Promise<{
        stake: {
            id: string;
            createdAt: Date;
            userWallet: string;
            amount: number;
            agentId: string;
        };
        totalStake: number;
    }>;
    /**
     * Get total stake amount for an agent
     */
    getAgentTotalStake(agentId: string): Promise<number>;
    /**
     * Get all stakes by a user
     */
    getUserStakes(userWallet: string): Promise<({
        agent: {
            id: string;
            tokenSymbol: string;
            name: string;
            price: number;
        };
    } & {
        id: string;
        createdAt: Date;
        userWallet: string;
        amount: number;
        agentId: string;
    })[]>;
    /**
     * Get stakes for a specific agent
     */
    getAgentStakes(agentId: string): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.StakeGroupByOutputType, "userWallet"[]> & {
        _sum: {
            amount: number | null;
        };
    })[]>;
};
export default stakeService;
//# sourceMappingURL=stakeService.d.ts.map