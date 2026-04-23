import { Router, Request, Response } from 'express';
import { stakeService } from '../services/stakeService';

const router = Router();

// POST /api/stake
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userWallet, agentId, amount } = req.body;
    
    if (!userWallet || !agentId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await stakeService.stake(userWallet, agentId, amount);
    
    res.json({
      success: true,
      stake: result.stake,
      totalStake: result.totalStake
    });
  } catch (error: any) {
    console.error('Stake error:', error);
    res.status(500).json({ error: error.message || 'Stake failed' });
  }
});

// GET /api/stake/agent/:id
router.get('/agent/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const totalStake = await stakeService.getAgentTotalStake(id);
    const stakes = await stakeService.getAgentStakes(id);
    
    res.json({ totalStake, stakes });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch stakes' });
  }
});

// GET /api/stake/user/:wallet
router.get('/user/:wallet', async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    const stakes = await stakeService.getUserStakes(wallet);
    res.json({ stakes });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch user stakes' });
  }
});

export default router;