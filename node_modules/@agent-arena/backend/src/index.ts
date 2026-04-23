import express from 'express';
import cors from 'cors';
import { runBattleTick } from './routes/battle';
import agentRoutes from './routes/agents';
import battleRoutes from './routes/battle';
import tradeRoutes from './routes/trade';
import stakeRoutes from './routes/stake';
import rewardRoutes from './routes/reward';
import leaderboardRoutes from './routes/leaderboard';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/battle', battleRoutes);
app.use('/api', tradeRoutes);

app.use('/api/stake', stakeRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);


// ✅ SERVER-SIDE BATTLE LOOP - Runs independently of frontend
let battleInterval: ReturnType<typeof setInterval> | null = null;

function startBattleLoop() {
  if (battleInterval) clearInterval(battleInterval);
  battleInterval = setInterval(async () => {
    await runBattleTick();
  }, 4000); // Every 4 seconds
  console.log('⚔️ Battle loop started (server-side)');
}

function stopBattleLoop() {
  if (battleInterval) {
    clearInterval(battleInterval);
    battleInterval = null;
    console.log('🛑 Battle loop stopped');
  }
}

// Start loop on server startup
startBattleLoop();

// Optional: Handle graceful shutdown
process.on('SIGINT', () => {
  stopBattleLoop();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;