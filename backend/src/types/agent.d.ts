export type ActionType = 'attack' | 'defend' | 'adapt';
export interface AgentState {
    score: number;
    lastAction: ActionType | null;
    lastActiveAt: number;
}
export interface AgentReputation {
    wins: number;
    losses: number;
    winRate: number;
}
export interface AgentToken {
    symbol: string;
    price: number;
    supply: number;
    mint: string;
}
export interface Agent {
    id: string;
    owner: string;
    name: string;
    strategy: string;
    personality: string;
    state: AgentState;
    reputation: AgentReputation;
    token: AgentToken;
    totalStake: number;
    active: boolean;
    createdAt: number;
}
export interface AgentUpdate {
    id: string;
    score: number;
    lastAction: ActionType | null;
    tokenPrice: number;
    priceChange: number;
    timestamp: number;
}
//# sourceMappingURL=agent.d.ts.map