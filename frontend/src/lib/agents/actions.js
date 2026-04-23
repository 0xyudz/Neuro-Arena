// frontend/src/lib/agents/actions.ts
import { Agent, AgentAction } from '../../types/agent';
const BASE_OUTCOMES = {
    attack: { success: 0.6, win: 5, lose: -3 },
    defend: { success: 0.9, win: 2, lose: -1 },
    adapt: { success: 0.7, win: 4, lose: -2 },
};
export function executeAction(agent, action) {
    const { runtime, financial } = agent;
    const config = BASE_OUTCOMES[action];
    const stakeBonus = financial.totalStake * 0.02;
    const roll = Math.random();
    const success = roll < config.success;
    const baseScore = success ? config.win : config.lose;
    const variance = (Math.random() - 0.5) * 2;
    const scoreDelta = Math.round((baseScore + stakeBonus + variance) * 10) / 10;
    const reasons = {
        attack: { true: 'Attack successful', false: 'Attack failed' },
        defend: { true: 'Defense held', false: 'Defense broken' },
        idle: { true: 'Position maintained', false: 'Missed opportunity' },
    };
    return {
        scoreDelta: Math.max(-10, Math.min(15, scoreDelta)),
        success,
        reason: reasons[action][success],
    };
}
export function calculatePrice(score, stake) {
    const base = 0.01;
    const scoreFactor = score * 0.0001;
    const stakeFactor = stake * 0.00001;
    return Math.max(0.001, Math.min(100, base + scoreFactor + stakeFactor));
}
//# sourceMappingURL=actions.js.map