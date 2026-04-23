import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// POST /api/buy
router.post('/buy', async (req, res) => {
  try {
    const { agentId, amount } = req.body;
    
    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const priceImpact = 0.02; // +2%
    const newPrice = agent.price * (1 + priceImpact);
    const newHolders = agent.holders + 1;
    const newMarketCap = newPrice * 1000000000;
    const newVolume = agent.volume24h + amount;
    const newTrades = agent.trades + 1;

    await prisma.agent.update({
      where: { id: agentId },
      data: {
        price: newPrice,
        marketCap: newMarketCap,
        holders: newHolders,
        volume24h: newVolume,
        trades: newTrades,
        priceChange: priceImpact * 100
      }
    });

    await prisma.transaction.create({
      data: {
        agentId,
        type: 'buy',
        amount,
        price: agent.price
      }
    });

    res.json({
      success: true,
      newPrice,
      newHolders,
      message: 'Buy successful'
    });
  } catch (error) {
    console.error('Buy error:', error);
    res.status(500).json({ error: 'Buy failed' });
  }
});

// POST /api/sell
router.post('/sell', async (req, res) => {
  try {
    const { agentId, amount } = req.body;
    
    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const priceImpact = -0.02; // -2%
    const newPrice = Math.max(0.00000001, agent.price * (1 + priceImpact));
    const newMarketCap = newPrice * 1000000000;
    const newVolume = agent.volume24h + amount;
    const newTrades = agent.trades + 1;

    await prisma.agent.update({
      where: { id: agentId },
      data: {
        price: newPrice,
        marketCap: newMarketCap,
        volume24h: newVolume,
        trades: newTrades,
        priceChange: priceImpact * 100
      }
    });

    await prisma.transaction.create({
      data: {
        agentId,
        type: 'sell',
        amount,
        price: agent.price
      }
    });

    res.json({
      success: true,
      newPrice,
      message: 'Sell successful'
    });
  } catch (error) {
    console.error('Sell error:', error);
    res.status(500).json({ error: 'Sell failed' });
  }
});

export default router;