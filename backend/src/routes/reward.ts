import { Router, Request, Response } from 'express';
import { rewardService } from '../services/rewardService';

const router = Router();

// GET /api/rewards/:wallet
router.get('/:wallet', async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    const result = await rewardService.getUserRewards(wallet);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch rewards' });
  }
});

// ✅ NEW: POST /api/rewards/claim
router.post('/claim', async (req: Request, res: Response) => {
  try {
    const { userWallet } = req.body;
    if (!userWallet) return res.status(400).json({ error: 'userWallet required' });

    const result = await rewardService.claimRewards(userWallet);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Claim failed' });
  }
});

export default router;