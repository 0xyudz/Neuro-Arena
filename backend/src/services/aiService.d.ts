import { Agent, ActionType } from '@agent-arena/shared';
/**
 * Simple AI suggestion service - minimal implementation
 * Returns weighted action suggestions based on agent state
 * Does NOT call external LLM APIs (keep it simple)
 */
export declare const aiService: {
    /**
     * Suggest an action for an agent based on simple heuristics
     * @param agent - The agent making the decision
     * @param allAgents - All agents in the arena
     * @param defaultAction - Fallback action if logic doesn't decide
     */
    suggestAction(agent: Agent, allAgents: Agent[], defaultAction: ActionType): Promise<{
        action: ActionType;
        target?: string;
    } | null>;
    /**
     * Generate a simple "thought" string for logging/display
     * Purely cosmetic - no actual AI reasoning
     */
    generateThought(agent: Agent, action: ActionType, result: string): string;
};
//# sourceMappingURL=aiService.d.ts.map