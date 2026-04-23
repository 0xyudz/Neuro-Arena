import { Agent, AgentAction } from '../../types/agent';
export interface ActionResult {
    scoreDelta: number;
    success: boolean;
    reason: string;
}
export declare function executeAction(agent: Agent, action: AgentAction): ActionResult;
export declare function calculatePrice(score: number, stake: number): number;
//# sourceMappingURL=actions.d.ts.map