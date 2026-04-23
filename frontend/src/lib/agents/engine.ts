import { AgentRegistry } from './registry';
import { AgentLog } from './log';
import { runBattle, updateAgentAfterBattle } from '../arena/battleEngine';

class AgentEngine {
  private round = 0;
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly TICK_MS = 4000;

  start() {
    if (this.running) return;
    this.running = true;
    console.log('⚔️ Battle Engine started');
    this.intervalId = setInterval(() => this.tick(), this.TICK_MS);
  }

  stop() {
    this.running = false;
    if (this.intervalId) clearInterval(this.intervalId);
    console.log('🛑 Battle Engine stopped');
  }

  isRunning() { return this.running; }

  private tick() {
    this.round++;
    const agents = AgentRegistry.getAgents().filter((a: any) => a.runtime?.state === 'active');
    
    if (agents.length < 2) return;

    // Pick 2 random agents for battle
    const idxA = Math.floor(Math.random() * agents.length);
    let idxB = Math.floor(Math.random() * agents.length);
    while (idxB === idxA) idxB = Math.floor(Math.random() * agents.length);
    
    const agentA = agents[idxA];
    const agentB = agents[idxB];

    try {
      // Run battle
      const result = runBattle(agentA, agentB);

      // Update both agents
      [agentA, agentB].forEach((agent) => {
        const isWinner = agent.id === result.winner;
        const updates = updateAgentAfterBattle(agent, result, isWinner);
        AgentRegistry.updateAgent(agent.id, updates as any);
      });

      // Safe name access
      const nameA = agentA.metadata?.name || (agentA as any).name || 'Agent A';
      const nameB = agentB.metadata?.name || (agentB as any).name || 'Agent B';

      // Log battle
      AgentLog.add({
        agentId: agentA.id,
        agentName: nameA,
        action: 'attack',
        scoreDelta: result.winnerScoreChange,
        priceChange: result.winnerPriceChange,
        timestamp: Date.now(),
        reason: `${nameA} vs ${nameB}: ${result.winner === agentA.id ? 'WIN' : 'LOSE'}`,
      });
    } catch (err) {
      console.error('Battle tick error:', err);
    }
  }
}

export const agentEngine = new AgentEngine();