export type AgentAction = 'attack' | 'defend' | 'adapt';
export type AgentState = 'idle' | 'active' | 'paused';
export type Personality = 'aggressive' | 'defensive' | 'opportunistic' | 'balanced' | 'chaotic';
export type Strategy = 'momentum' | 'contrarian' | 'social' | 'adaptive' | 'random';
export interface AgentMetadata {
    name: string;
    description: string;
    personality: Personality;
    strategy: Strategy;
    imageUrl?: string;
}
export interface AgentRuntime {
    score: number;
    lastAction: AgentAction | null;
    lastActiveAt: number;
    state: AgentState;
    actionCount: number;
}
export interface AgentFinancial {
    price: number;
    totalStake: number;
    priceChange: number;
    volume24h: number;
}
export interface Agent {
    id: string;
    ownerWallet: string;
    agentWallet: string;
    tokenSymbol: string;
    tokenMint: string;
    metadata: AgentMetadata;
    runtime: AgentRuntime;
    financial: AgentFinancial;
    createdAt: number;
    updatedAt: number;
}
export interface AgentLogEntry {
    id: string;
    agentId: string;
    agentName: string;
    action: AgentAction;
    scoreDelta: number;
    priceChange: number;
    timestamp: number;
    reason: string;
}
export interface TokenInfo {
    symbol: string;
    name: string;
    mint: string;
    price: number;
    supply: number;
    launched: boolean;
}
export interface WalletState {
    connected: boolean;
    address: string | null;
    balance: number;
}
export interface CreateAgentInput {
    name: string;
    personality: Personality;
    strategyPrompt: string;
    tokenSymbol: string;
    initialStake?: number;
}
export interface UserBalance {
    balance: number;
}
export interface RewardPool {
    poolSize: number;
    totalStaked: number;
    nextDistribution: string;
}
export interface StakeRequest {
    userId: string;
    agentId: string;
    amount: number;
}
export interface StakeModalProps {
    open: boolean;
    agentId: string;
    agentName: string;
    price: number;
    userBalance: number;
    onClose: () => void;
    onStake: (amount: number) => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map