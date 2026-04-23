import { prisma } from '../config/database';
import { stakeService } from './stakeService';

export const rewardService = {
  /**
   * Distribute rewards to stakers when agent wins a battle
   * rewardPool = 1% of agent's current market cap (configurable)
   */
  async distributeBattleReward(agentId: string, rewardPool?: number) {
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) throw new Error('Agent not found');

    // Default: 1% of market cap as reward pool
    const pool = rewardPool ?? agent.marketCap * 0.01;

    const totalStake = await stakeService.getAgentTotalStake(agentId);
    if (totalStake <= 0) return { distributed: 0, recipients: 0 };

    // Get all stakers for this agent
    const stakes = await prisma.stake.groupBy({
      by: ['userWallet'],
      where: { agentId },
      _sum: { amount: true }
    });

    let distributed = 0;
    const rewards: Array<{ userWallet: string; amount: number }> = [];

    for (const stake of stakes) {
      const share = (stake._sum.amount ?? 0) / totalStake;
      const userReward = pool * share;

      if (userReward > 0) {
        await prisma.reward.create({
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
  async getUserRewards(userWallet: string) {
    return prisma.reward.findMany({
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
  async getUserTotalRewards(userWallet: string): Promise<number> {
    const result = await prisma.reward.aggregate({
      where: { userWallet },
      _sum: { amount: true }
    });
    return result._sum.amount ?? 0;
  },

  /**
   * Get rewards for a user (includes claimed status)
   */
  async getUserRewards(userWallet: string) {
    const rewards = await prisma.reward.findMany({
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
  async claimRewards(userWallet: string) {
    const unclaimed = await prisma.reward.findMany({
      where: { userWallet, claimed: false }
    });

    if (unclaimed.length === 0) {
      return { success: true, totalClaimed: 0, count: 0 };
    }

    const totalClaimed = unclaimed.reduce((sum, r) => sum + r.amount, 0);

    await prisma.reward.updateMany({
      where: { userWallet, claimed: false },
      data: { claimed: true, claimedAt: new Date() }
    });

return { success: true, totalClaimed, count: unclaimed.length };
  },

  /**
   * Get user stake & rewards for a specific agent
   */
  async getUserAgentStats(userWallet: string, agentId: string) {
  const stakes = await prisma.stake.findMany({
    where: { userWallet, agentId },
    select: { amount: true }
  });

  const rewards = await prisma.reward.findMany({
    where: { userWallet, agentId },
    select: { amount: true, claimed: true }
  });

  const totalStaked = stakes.reduce((sum, s) => sum + s.amount, 0);
  const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
  const unclaimedRewards = rewards.filter(r => !r.claimed).reduce((sum, r) => sum + r.amount, 0);

  return { totalStaked, totalRewards, unclaimedRewards };
}
};

export default rewardService;