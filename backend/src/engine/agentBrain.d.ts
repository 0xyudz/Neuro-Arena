import { Agent } from '@prisma/client';
export type AgentAction = 'attack' | 'defend' | 'idle';
export interface BattleContext {
    agent: Agent;
    opponent: Agent;
}
/**
 * Determine agent's action based on strategy, confidence, and opponent stats
 * ✅ ENHANCED: Fairness & balance improvements
 */
export declare function decideAction(agent: Agent, opponent: Agent): AgentAction;
/**
 * Get human-readable personality label
 */
export declare function getAgentPersonality(agent: Agent): string;
/**
 * Update agent stats and adapt strategy after battle
 */
export declare function updateAgentAfterBattle(agent: Agent, result: 'win' | 'lose' | 'draw'): Partial<Agent>;
declare const _default: {
    decideAction: typeof decideAction;
    getAgentPersonality: typeof getAgentPersonality;
    updateAgentAfterBattle: typeof updateAgentAfterBattle;
};
export default _default;
//# sourceMappingURL=agentBrain.d.ts.map