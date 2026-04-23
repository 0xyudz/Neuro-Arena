export type AgentAction = 'attack' | 'defend' | 'idle';
export type BattleResult = 'win' | 'lose' | 'draw';
export type Personality = 'aggressive' | 'defensive' | 'balanced' | 'opportunistic' | 'chaotic';
export type Strategy = 'aggressive' | 'defensive' | 'balanced';
export interface AgentAttributes {
    risk: number;
    consistency: number;
    speed: number;
}
export interface ServiceEndpoint {
    name: string;
    endpoint: string;
}
export interface AgentRuntime {
    score: number;
    lastAction: AgentAction | BattleResult | null;
    lastActiveAt: number;
    state: 'active' | 'inactive' | 'paused';
    actionCount: number;
    isChampion: boolean;
    history: Array<{
        result: BattleResult;
        scoreChange: number;
        timestamp: number;
    }>;
}
export interface AgentFinancial {
    price: number;
    totalStake: number;
    priceChange: number;
    volume24h: number;
}
export interface AgentToken {
    mint: string;
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    holders: number;
    priceChange: number;
    circulatingSupply: number;
}
export interface Agent {
    id: string;
    ownerWallet: string;
    agentWallet: string;
    tokenSymbol: string;
    tokenMint: string;
    name: string;
    description?: string;
    personality: Personality;
    strategy: Strategy;
    imageUrl?: string | null;
    confidence?: number;
    winStreak?: number;
    loseStreak?: number;
    recentTrend?: 'hot' | 'cold' | 'stable';
    wins?: number;
    losses?: number;
    score: number;
    lastAction: AgentAction | BattleResult | null;
    isChampion: boolean;
    price: number;
    marketCap: number;
    priceChange: number;
    holders: number;
    volume24h: number;
    trades: number;
    attributes?: AgentAttributes;
    metadata?: {
        services?: ServiceEndpoint[];
        name?: string;
        strategy?: Strategy;
        personality?: Personality;
    };
    runtime?: AgentRuntime;
    financial?: AgentFinancial;
    token?: AgentToken;
    createdAt: string;
    updatedAt: string;
}
export interface BattleLog {
    id: string;
    agentId: string;
    agentName?: string;
    opponentId: string;
    opponentName?: string;
    result: BattleResult;
    scoreChange: number;
    priceChange: number;
    reason: string;
    thinkingTrace?: any;
    timestamp: number;
}
export interface Stake {
    id: string;
    userWallet: string;
    agentId: string;
    amount: number;
    createdAt: string;
    agent?: {
        id: string;
        name: string;
        tokenSymbol: string;
        price: number;
    };
}
export interface Reward {
    id: string;
    userWallet: string;
    agentId: string;
    amount: number;
    claimed: boolean;
    createdAt: string;
    agent?: {
        id: string;
        name: string;
        tokenSymbol: string;
    };
}
//# sourceMappingURL=agent.d.ts.map