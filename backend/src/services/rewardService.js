"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardService = void 0;
const database_1 = require("../config/database");
const stakeService_1 = require("./stakeService");
exports.rewardService = {
    /**
     * Distribute rewards to stakers when agent wins a battle
     * rewardPool = 1% of agent's current market cap (configurable)
     */
    async distributeBattleReward(agentId, rewardPool) {
        const agent = await database_1.prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent)
            throw new Error('Agent not found');
        // Default: 1% of market cap as reward pool
        const pool = rewardPool ?? agent.marketCap * 0.01;
        const totalStake = await stakeService_1.stakeService.getAgentTotalStake(agentId);
        if (totalStake <= 0)
            return { distributed: 0, recipients: 0 };
        // Get all stakers for this agent
        const stakes = await database_1.prisma.stake.groupBy({
            by: ['userWallet'],
            where: { agentId },
            _sum: { amount: true }
        });
        let distributed = 0;
        const rewards = [];
        for (const stake of stakes) {
            const share = (stake._sum.amount ?? 0) / totalStake;
            const userReward = pool * share;
            if (userReward > 0) {
                await database_1.prisma.reward.create({
                    data: {
                        userWallet: stake.userWallet,
                        agentId,
                        amount: userReward,
                        reason: 'battle_win'
                    }
                });
                distributed += userReward;
                rewards.push({ userWallet: stake.userWallet, amount: userReward });
            }
        }
        return { distributed, recipients: rewards.length, rewards };
    },
    /**
     * Get rewards for a user
     */
    async getUserRewards(userWallet) {
        return database_1.prisma.reward.findMany({
            where: { userWallet },
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        tokenSymbol: true
                    }
                }
            }
        });
    },
    /**
     * Get total rewards earned by user
     */
    async getUserTotalRewards(userWallet) {
        const result = await database_1.prisma.reward.aggregate({
            where: { userWallet },
            _sum: { amount: true }
        });
        return result._sum.amount ?? 0;
    },
    /**
     * Get rewards for a user (includes claimed status)
     */
    async getUserRewards(userWallet) {
        const rewards = await database_1.prisma.reward.findMany({
            where: { userWallet },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                agent: { select: { id: true, name: true, tokenSymbol: true } }
            }
        });
        const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
        const unclaimed = rewards.filter(r => !r.claimed).reduce((sum, r) => sum + r.amount, 0);
        return { totalRewards, unclaimed, rewards };
    },
    /**
     * Claim all unclaimed rewards for a user
     */
    async claimRewards(userWallet) {
        const unclaimed = await database_1.prisma.reward.findMany({
            where: { userWallet, claimed: false }
        });
        if (unclaimed.length === 0) {
            return { success: true, totalClaimed: 0, count: 0 };
        }
        const totalClaimed = unclaimed.reduce((sum, r) => sum + r.amount, 0);
        await database_1.prisma.reward.updateMany({
            where: { userWallet, claimed: false },
            data: { claimed: true, claimedAt: new Date() }
        });
        return { success: true, totalClaimed, count: unclaimed.length };
    },
    /**
     * Get user stake & rewards for a specific agent
     */
    async getUserAgentStats(userWallet, agentId) {
        const stakes = await database_1.prisma.stake.findMany({
            where: { userWallet, agentId },
            select: { amount: true }
        });
        const rewards = await database_1.prisma.reward.findMany({
            where: { userWallet, agentId },
            select: { amount: true, claimed: true }
        });
        const totalStaked = stakes.reduce((sum, s) => sum + s.amount, 0);
        const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
        const unclaimedRewards = rewards.filter(r => !r.claimed).reduce((sum, r) => sum + r.amount, 0);
        return { totalStaked, totalRewards, unclaimedRewards };
    }
};
exports.default = exports.rewardService;
//# sourceMappingURL=rewardService.js.map