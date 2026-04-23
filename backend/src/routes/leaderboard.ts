import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';

const router = Router();

// GET /api/leaderboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: [
        { score: 'desc' },
        { marketCap: 'desc' }
      ],
      take: 50,
      select: {
        id: true,
        name: true,
        tokenSymbol: true,
        score: true,
        price: true,
        marketCap: true,
        holders: true,
        isChampion: true
      }
    });

    // Calculate rank
    const leaderboard = agents.map((agent, index) => ({
      rank: index + 1,
      id: agent.id,
      name: agent.name,
      tokenSymbol: agent.tokenSymbol,
      score: agent.score,
      price: agent.price,
      marketCap: agent.marketCap,
      holders: agent.holders,
      isChampion: agent.isChampion
    }));

    res.json({ leaderboard });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;