export type PersonalityType = 'aggressive' | 'defensive' | 'opportunistic' | 'balanced' | 'chaotic';
export type StrategyType = 'momentum' | 'contrarian' | 'random' | 'adaptive' | 'social';
export type ActionType = 'attack' | 'defend' | 'boost' | 'retreat' | 'observe' | 'ally';
export type ActionResult = 'success' | 'failure' | 'partial' | 'neutral';
export interface Agent {
    id: string;
    name: string;
    personality: PersonalityType;
    strategy: StrategyType;
    description: string;
    imageUrl: string;
    tokenMint: string;
    createdAt: string;
    score: number;
    history: AgentAction[];
}
export interface AgentAction {
    timestamp: string;
    action: ActionType;
    target?: string;
    result: ActionResult;
    scoreDelta: number;
    metadata?: Record<string, any>;
}
export interface TokenInfo {
    mint: string;
    name: string;
    symbol: string;
    description: string;
    imageUrl: string;
    priceSol: number;
    marketCapSol: number;
    holders: number;
    volume24h: number;
}
export interface CreateAgentRequest {
    name: string;
    personality: PersonalityType;
    strategy: StrategyType;
    description: string;
    imageUrl: string;
    initialBuySol?: number;
}
export interface CreateAgentResponse {
    success: boolean;
    agent: Agent;
    tokenMint: string;
    transactionSignature?: string;
}
export interface SimulationUpdate {
    agents: Array<{
        id: string;
        score: number;
        lastAction: AgentAction;
    }>;
    timestamp: string;
    round: number;
}
export interface LeaderboardEntry {
    rank: number;
    agentId: string;
    name: string;
    score: number;
    winRate: number;
    tokenMint: string;
}
export type WsMessageType = 'arena_update' | 'agent_created' | 'leaderboard_update' | 'token_price_update' | 'connection_established';
export interface WsMessage<T = any> {
    type: WsMessageType;
    payload: T;
    timestamp: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
