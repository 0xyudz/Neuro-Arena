"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakeService = void 0;
const database_1 = require("../config/database");
exports.stakeService = {
    /**
     * Stake tokens on an agent
     */
    async stake(userWallet, agentId, amount) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        // Verify agent exists
        const agent = await database_1.prisma.agent.findUnique({ where: { id: agentId } });
        if (!agent)
            throw new Error('Agent not found');
        // Create stake record
        const stake = await database_1.prisma.stake.create({
            data: {
                userWallet,
                agentId,
                amount,
            }
        });
        // Update agent's totalStake (denormalized for performance)
        const totalStake = await this.getAgentTotalStake(agentId);
        await database_1.prisma.agent.update({
            where: { id: agentId },
            data: { financial: { totalStake } }
        });
        return { stake, totalStake };
    },
    /**
     * Get total stake amount for an agent
     */
    async getAgentTotalStake(agentId) {
        const result = await database_1.prisma.stake.aggregate({
            where: { agentId },
            _sum: { amount: true }
        });
        return result._sum.amount ?? 0;
    },
    /**
     * Get all stakes by a user
     */
    async getUserStakes(userWallet) {
        return database_1.prisma.stake.findMany({
            where: { userWallet },
            orderBy: { createdAt: 'desc' },
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        tokenSymbol: true,
                        price: true
                    }
                }
            }
        });
    },
    /**
     * Get stakes for a specific agent
     */
    async getAgentStakes(agentId) {
        return database_1.prisma.stake.groupBy({
            by: ['userWallet'],
            where: { agentId },
            _sum: { amount: true },
            orderBy: { _sum: { amount: 'desc' } }
        });
    }
};
exports.default = exports.stakeService;
//# sourceMappingURL=stakeService.js.map