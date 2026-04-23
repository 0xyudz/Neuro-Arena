export interface AgentMetadata {
    name: string;
    description: string;
    personality: string;
    strategy: string;
    imageUrl: string | null;
    services: Array<{
        name: string;
        endpoint: string;
    }>;
}
export interface AgentAttributes {
    risk: number;
    consistency: number;
    speed: number;
}
export interface AgentRuntime {
    score: number;
    lastAction: string;
    lastActiveAt: number;
    state: string;
    actionCount: number;
    isChampion: boolean;
    history: BattleRecord[];
}
export interface AgentFinancial {
    price: number;
    totalStake: number;
    priceChange: number;
    volume24h: number;
}
export interface TokenInfo {
    mint: string;
    name: string;
    symbol: string;
    description: string;
    imageUrl: string;
    supply: number;
    circulatingSupply: number;
    price: number;
    previousPrice: number;
    priceChange: number;
    marketCap: number;
    volume24h: number;
    trades: number;
    holders: number;
    createdAt: number;
    transactions: Transaction[];
}
export interface Transaction {
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    timestamp: number;
}
export interface BattleRecord {
    opponentId: string;
    opponentName: string;
    result: 'win' | 'lose';
    scoreChange: number;
    priceChange: number;
    timestamp: number;
}
export interface Agent {
    id: string;
    ownerWallet: string;
    agentWallet: string;
    tokenSymbol: string;
    tokenMint: string;
    metadata: AgentMetadata;
    attributes: AgentAttributes;
    runtime: AgentRuntime;
    financial: AgentFinancial;
    token?: TokenInfo;
    createdAt: number;
    updatedAt: number;
}
export interface AgentsResponse {
    agents: Agent[];
}
export interface AgentResponse {
    agent: Agent;
}
export interface CreateAgentPayload {
    ownerWallet: string;
    agentWallet: string;
    tokenSymbol: string;
    tokenMint: string;
    name: string;
    description?: string;
    personality?: string;
    strategy?: string;
    imageUrl?: string;
    score?: number;
    lastAction?: string;
    isChampion?: boolean;
    price?: number;
    marketCap?: number;
    holders?: number;
    volume24h?: number;
    trades?: number;
}
//# sourceMappingURL=agent.d.ts.map