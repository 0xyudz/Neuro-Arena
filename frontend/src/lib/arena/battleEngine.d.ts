import { Agent } from '../../types/agent';
export interface BattleResult {
    winner: string;
    loser: string;
    winnerScoreChange: number;
    loserScoreChange: number;
    winnerPriceChange: number;
    loserPriceChange: number;
}
export declare function runBattle(agentA: Agent, agentB: Agent): BattleResult;
export declare function updateAgentAfterBattle(agent: Agent, result: BattleResult, isWinner: boolean): Partial<Agent>;
export declare function boostAgent(agent: Agent): Partial<Agent>;
//# sourceMappingURL=battleEngine.d.ts.map