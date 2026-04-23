// Server-agnostic agent decision engine
import { Agent, ActionType, Personality } from '../types';
export const agentEngine = {
    /**
     * Decide action based on strategy prompt + personality + game state
     */
    decideAction(ctx) {
        const { agent, opponents, round } = ctx;
        const { personality, strategyPrompt, score, totalStake } = agent;
        // Extract keywords from strategy prompt
        const prompt = strategyPrompt.toLowerCase();
        const isAggressive = prompt.includes('attack') || personality === 'aggressive';
        const isDefensive = prompt.includes('defend') || personality === 'defensive';
        const isAdaptive = prompt.includes('adapt') || personality === 'opportunistic';
        // Calculate threat level (avg opponent score vs agent)
        const avgOpponentScore = opponents.length > 0
            ? opponents.filter(o => o.id !== agent.id).reduce((s, o) => s + o.score, 0) / Math.max(1, opponents.length - 1)
            : 0;
        const isWinning = score > avgOpponentScore * 1.1;
        const isLosing = score < avgOpponentScore * 0.9;
        // Stake influences aggression
        const stakeFactor = Math.min(1, totalStake / 100);
        // Decision tree
        if (isLosing && isAdaptive) {
            return { action: 'adapt', reason: 'Adapting strategy after losses' };
        }
        if (isWinning && (isAggressive || stakeFactor > 0.5)) {
            return { action: 'attack', reason: 'Pressing advantage with high stake' };
        }
        if (isDefensive && !isWinning) {
            return { action: 'defend', reason: 'Defensive posture to preserve score' };
        }
        if (personality === 'chaotic' && Math.random() < 0.3) {
            return { action: 'ally', reason: 'Chaotic alliance attempt' };
        }
        // Default: balanced approach
        return {
            action: Math.random() > 0.5 ? 'attack' : 'observe',
            reason: 'Balanced strategy execution',
        };
    },
    /**
     * Calculate score delta with stake bonus
     */
    calculateOutcome(action, success, totalStake) {
        const base = {
            attack: success ? 5 : -3,
            defend: 2,
            adapt: success ? 4 : -1,
            observe: 0.5,
            ally: success ? 3 : -2,
        }[action];
        const stakeBonus = totalStake * 0.02;
        const variance = (Math.random() - 0.5) * 2;
        return Math.round((base + stakeBonus + variance) * 10) / 10;
    },
};
//# sourceMappingURL=agentEngine.js.map