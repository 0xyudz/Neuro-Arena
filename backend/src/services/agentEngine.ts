import { prisma } from '../config/database';
import { broadcastUpdate } from '../websocket/broadcast';

class AgentEngine {
  private round = 0;
  private running = false;
  private interval: any = null;

  // ✅ Method ini HARUS ada
  start() {
    if (this.running) return;
    this.running = true;
    console.log('🤖 Agent engine STARTED - running every 3 seconds');
    
    this.interval = setInterval(async () => {
      try {
        await this.runRound();
      } catch (err) {
        console.error('Engine round error:', err);
      }
    }, 3000);
  }

  stop() {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
      console.log('🛑 Agent engine STOPPED');
    }
  }

  private async runRound() {
    this.round++;
    console.log(`🎮 Round #${this.round}`);

    const agents = await prisma.agent.findMany({ 
      where: { active: true } 
    });

    if (agents.length < 1) {
      console.log('⏳ No active agents');
      return;
    }

    const updates: any[] = [];

    for (const agent of agents) {
      // Simple logic: attack if score > 100, else defend
      const action = agent.score > 100 ? 'attack' : 'defend';
      const delta = action === 'attack' ? 5 : 2;
      const newScore = agent.score + delta;
      const newPrice = 0.01 + (newScore * 0.0001) + (agent.totalStake * 0.00001);
      
      // ✅ CRITICAL: Ketik persis "data: {"
      await prisma.agent.update({
        where: { id: agent.id },
         data:{
          score: newScore,
          tokenPrice: newPrice,
          priceChange: ((newPrice - agent.tokenPrice) / agent.tokenPrice) * 100,
          lastActionAt: new Date(),
        },
      });

      updates.push({
        id: agent.id,
        score: newScore,
        lastAction: action,
        tokenPrice: newPrice,
        priceChange: ((newPrice - agent.tokenPrice) / agent.tokenPrice) * 100,
      });
    }

    // Broadcast ke frontend
    broadcastUpdate({
      type: 'agent_updates',
      payload: { updates, round: this.round },
      timestamp: Date.now(),
    });

    console.log(`✅ Round ${this.round} complete - ${updates.length} agents updated`);
  }
}

// ✅ Export instance
export const agentEngine = new AgentEngine();