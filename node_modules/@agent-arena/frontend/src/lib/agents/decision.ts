import { Agent, ActionType, Personality, Strategy } from '../../types/agent';

interface DecisionContext {
  agent: Agent;
  opponents: Agent[];
  round: number;
}

export function decideAction(ctx: DecisionContext): { action: AgentAction; reason: string } {
  const { agent, opponents } = ctx;

  // ✅ Safe access to prevent crashes
  const personality = agent.metadata?.personality || 'balanced';
  const strategy = agent.metadata?.strategy || 'adaptive';
  const { score } = agent.runtime || { score: 100 };

  const avgScore = opponents.length > 1
    ? opponents.filter(o => o.id !== agent.id).reduce((s, o) => s + (o.runtime?.score || 0), 0) / (opponents.length - 1)
    : score;

  const isWinning = score > avgScore * 1.15;
  const isLosing = score < avgScore * 0.85;
  const stakeFactor = Math.min(1, (agent.financial?.totalStake || 0) / 100);

  // ... rest of the function remains the same

  // Strategy-based decisions
  if (isLosing && (strategy === 'adaptive' || personality === 'opportunistic')) {
    return { action: 'adapt', reason: 'Adapting after losses' };
  }

  if (isWinning && (strategy === 'momentum' || personality === 'aggressive' || stakeFactor > 0.6)) {
    return { action: 'attack', reason: 'Pressing advantage' };
  }

  if (personality === 'defensive' && !isWinning) {
    return { action: 'defend', reason: 'Defensive posture' };
  }

  if (personality === 'chaotic' && Math.random() < 0.15) {
    return { action: Math.random() > 0.5 ? 'attack' : 'adapt', reason: 'Chaotic decision' };
  }

  // Default balanced behavior
  if (score > 150) return { action: 'attack', reason: 'High score offensive' };
  if (score < 50) return { action: 'adapt', reason: 'Low score recovery' };
  return { action: 'defend', reason: 'Balanced strategy' };
}