import { Agent } from '../../types/agent';
interface DecisionContext {
    agent: Agent;
    opponents: Agent[];
    round: number;
}
export declare function decideAction(ctx: DecisionContext): {
    action: AgentAction;
    reason: string;
};
export {};
//# sourceMappingURL=decision.d.ts.map