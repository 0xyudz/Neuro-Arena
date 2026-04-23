import { Agent, LeaderboardEntry, WsMessage } from '@agent-arena/shared';
interface ArenaState {
    agents: Agent[];
    leaderboard: LeaderboardEntry[];
    currentRound: number;
    isLoading: boolean;
    error: string | null;
    selectedAgent: Agent | null;
    wsConnected: boolean;
    fetchAgents: () => Promise<void>;
    fetchLeaderboard: () => Promise<void>;
    fetchAgent: (id: string) => Promise<Agent | null>;
    createAgent: (data: any) => Promise<any>;
    handleWsMessage: (message: WsMessage) => void;
    connectWebSocket: () => void;
    disconnectWebSocket: () => void;
    setSelectedAgent: (agent: Agent | null) => void;
}
export declare const useArenaStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ArenaState>>;
export {};
//# sourceMappingURL=arenaStore.d.ts.map