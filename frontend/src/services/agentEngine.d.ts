import { Agent, ActionType } from '../types';
interface DecisionContext {
    agent: Agent;
    opponents: Agent[];
    round: number;
}
export declare const agentEngine: {
    /**
     * Decide action based on strategy prompt + personality + game state
     */
    decideAction(ctx: DecisionContext): {
        action: ActionType;
        reason: string;
    };
    /**
     * Calculate score delta with stake bonus
     */
    calculateOutcome(action: ActionType, success: boolean, totalStake: number): number;
};
export {};
//# sourceMappingURL=agentEngine.d.ts.map