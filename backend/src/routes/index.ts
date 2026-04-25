// backend/src/routes/index.ts
// Minimal route setup for Neuro Arena backend

import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { broadcastUpdate } from '../websocket/broadcast';
import { agentEngine } from '../services/agentEngine';

const router = Router();

// ============================================================================
// MIDDLEWARE: Basic error handler
// ============================================================================
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

// ... existing imports ...

// ============================================================================
// STAKING & TOKEN API
// ============================================================================

// GET /api/user/:userId/balance - Get user ARENA balance
router.get('/user/:userId/balance', asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  let balance = await prisma.userBalance.findUnique({
    where: { userId },
  });
  
  // Create if doesn't exist
  if (!balance) {
    balance = await prisma.userBalance.create({
      data: { userId, arenaBalance: 1000 },
    });
  }
  
  res.json({ balance: balance.arenaBalance });
}));

// POST /api/stake - Stake ARENA to an agent
router.post('/stake', asyncHandler(async (req: Request, res: Response) => {
  const { userId, agentId, amount } = req.body;
  
  if (!userId || !agentId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid stake parameters' });
  }
  
  // Get user balance
  const userBalance = await prisma.userBalance.findUnique({
    where: { userId },
  });
  
  if (!userBalance || userBalance.arenaBalance < amount) {
    return res.status(400).json({ error: 'Insufficient ARENA balance' });
  }
  
  // Get agent
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
  });
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  // Calculate tokens received (based on current price)
  const tokensReceived = amount / agent.tokenPrice;
  
  // Update user balance
  await prisma.userBalance.update({
    where: { userId },
    data: { arenaBalance: { decrement: amount } },
  });
  
  // Update agent stake
  await prisma.agent.update({
    where: { id: agentId },
    data: { 
      totalStake: { increment: amount },
      // Price increases slightly with more stake
      tokenPrice: { increment: amount * 0.0001 },
    },
  });
  
  // Record stake
  await prisma.stake.create({
    data: { userId, agentId, amount },
  });
  
  res.json({
    success: true,
    tokensReceived,
    newAgentPrice: agent.tokenPrice + (amount * 0.0001),
    message: `Staked ${amount} ARENA for ${tokensReceived.toFixed(4)} agent tokens`,
  });
}));

// POST /api/distribute-rewards - Distribute rewards to top agents
router.post('/distribute-rewards', asyncHandler(async (_req: Request, res: Response) => {
  // Get top 3 agents by score
  const topAgents = await prisma.agent.findMany({
    where: { active: true },
    orderBy: { score: 'desc' },
    take: 3,
  });
  
  const rewardPool = 100; // 100 ARENA per round
  const rewards = [50, 30, 20]; // Distribution percentages
  
  const results = [];
  
  for (let i = 0; i < topAgents.length; i++) {
    const agent = topAgents[i];
    const reward = rewardPool * (rewards[i] / 100);
    
    // Update agent: increase price based on reward
    const priceIncrease = reward * 0.01; // 1% per 100 ARENA reward
    const newPrice = agent.tokenPrice + priceIncrease;
    const priceChangePercent = ((priceIncrease / agent.tokenPrice) * 100);
    
    await prisma.agent.update({
      where: { id: agent.id },
      data: {
        tokenPrice: newPrice,
        priceChange: priceChangePercent,
        score: { increment: 10 }, // Bonus score for winning
      },
    });
    
    results.push({
      agentId: agent.id,
      name: agent.name,
      reward,
      newPrice,
      priceChange: priceChangePercent,
    });
  }
  
  // Broadcast reward event
  broadcastUpdate({
    type: 'rewards_distributed',
    payload: { results, timestamp: new Date().toISOString() },
    timestamp: new Date().toISOString(),
  });
  
  res.json({ success: true, rewards: results });
}));

// GET /api/reward-pool - Get current reward pool info
router.get('/reward-pool', asyncHandler(async (_req: Request, res: Response) => {
  // Calculate total staked
  const totalStaked = await prisma.agent.aggregate({
    _sum: { totalStake: true },
  });
  
  res.json({
    poolSize: 100, // Fixed pool per round
    totalStaked: totalStaked._sum.totalStake || 0,
    nextDistribution: new Date(Date.now() + 300000).toISOString(), // 5 min
  });
}));

router.get('/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});

// ============================================================================
// AGENTS API
// ============================================================================

// GET /api/agents - List all agents
router.get('/agents', asyncHandler(async (_req: Request, res: Response) => {
  const agents = await prisma.agent.findMany({
    where: { active: true },
    orderBy: { score: 'desc' },
    take: 100,
  });
  res.json({ agents });
}));

// GET /api/agents/:id - Get single agent
router.get('/agents/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const agent = await prisma.agent.findUnique({
    where: { id, active: true },
    include: { 
      history: { 
        orderBy: { timestamp: 'desc' }, 
        take: 20 
      } 
    },
  });
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  res.json({ agent });
}));

// POST /api/agents - Create new agent (MOCK MODE)
router.post('/agents', asyncHandler(async (req: Request, res: Response) => {
  const { name, personality, strategy, description, imageUrl, initialBuySol } = req.body;
  
  // Basic validation
  if (!name || !personality || !strategy) {
    return res.status(400).json({ error: 'Missing required fields: name, personality, strategy' });
  }
  
  // Generate mock token mint (in real mode, this would call Bags SDK)
  const mockTokenMint = 'Mock' + Buffer.from(name + Date.now()).toString('base64').slice(0, 44);
  
  // Create agent in database
  const agent = await prisma.agent.create({
    data: {
      name,
      personality,
      strategy,
      description: description || '',
      imageUrl: imageUrl || '',
      tokenMint: mockTokenMint,
      score: 100, // Starting score
    },
  });
  
  // Broadcast creation event via WebSocket
  broadcastUpdate({
    type: 'agent_created',
    payload: { agentId: agent.id, tokenMint: mockTokenMint },
    timestamp: new Date().toISOString(),
  });
  
  res.status(201).json({
    success: true,
    agent,
    tokenMint: mockTokenMint,
    message: '🎭 Mock mode: Token not launched on-chain. Add BAGS_API_KEY to .env for real launch.',
  });
}));

// ============================================================================
// SIMULATION API
// ============================================================================

// POST /api/simulate - Trigger one simulation round manually
router.post('/simulate', asyncHandler(async (_req: Request, res: Response) => {
  await agentEngine.runSimulation();
  res.json({ success: true, message: 'Simulation round triggered' });
}));

// ============================================================================
// LEADERBOARD API
// ============================================================================

// GET /api/leaderboard - Get top agents
router.get('/leaderboard', asyncHandler(async (_req: Request, res: Response) => {
  const agents = await prisma.agent.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      score: true,
      tokenMint: true,
      history: {
        select: { result: true },
      },
    },
    orderBy: { score: 'desc' },
    take: 50,
  });
  
  const leaderboard = agents.map((agent: any, index: number) => ({
    rank: index + 1,
    agentId: agent.id,
    name: agent.name,
    score: agent.score,
    winRate: agent.history.length > 0 
      ? agent.history.filter((h: any) => h.result === 'success').length / agent.history.length 
      : 0,
    tokenMint: agent.tokenMint,
  }));
  
  res.json({ leaderboard });
}));

// ============================================================================
// TOKEN INFO API (MOCK)
// ============================================================================

// GET /api/tokens/:mint - Get token info (mock data)
router.get('/tokens/:mint', asyncHandler(async (req: Request, res: Response) => {
  const { mint } = req.params;
  
  // Return mock token data (in real mode, query Bags API or Solana)
  res.json({
    mint,
    name: 'Mock Token',
    symbol: 'MOCK',
    priceSol: Math.random() * 0.1,
    marketCapSol: Math.random() * 100,
    holders: Math.floor(Math.random() * 1000),
    volume24h: Math.random() * 50,
    change24h: (Math.random() - 0.5) * 20,
  });
}));

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler for undefined routes
router.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Route error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// ============================================================================
// EXPORT SETUP FUNCTION
// ============================================================================

export function setupRoutes(app: any) {
  // Mount all routes under /api prefix
  app.use('/api', router);
  
  console.log('✅ API routes mounted at /api');
}

export default router;