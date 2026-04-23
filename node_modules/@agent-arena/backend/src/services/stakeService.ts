import { prisma } from '../config/database';

export const stakeService = {
  /**
   * Stake tokens on an agent
   */
  async stake(userWallet: string, agentId: string, amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive');

    // Verify agent exists
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new Error('Agent not found');

    // Create stake record
    const stake = await prisma.stake.create({
       data: {
        userWallet,
        agentId,
        amount,
      }
    });

    // Update agent's totalStake (denormalized for performance)
    const totalStake = await this.getAgentTotalStake(agentId);
    await prisma.agent.update({
      where: { id: agentId },
      data: { financial: { totalStake } }
    });

    return { stake, totalStake };
  },

  /**
   * Get total stake amount for an agent
   */
  async getAgentTotalStake(agentId: string): Promise<number> {
    const result = await prisma.stake.aggregate({
      where: { agentId },
      _sum: { amount: true }
    });
    return result._sum.amount ?? 0;
  },

  /**
   * Get all stakes by a user
   */
  async getUserStakes(userWallet: string) {
    return prisma.stake.findMany({
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
  async getAgentStakes(agentId: string) {
    return prisma.stake.groupBy({
      by: ['userWallet'],
      where: { agentId },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } }
    });
  }
};

export default stakeService;