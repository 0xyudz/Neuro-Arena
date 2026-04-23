import { create } from 'zustand';
import { Agent, SimulationUpdate, LeaderboardEntry, WsMessage } from '@agent-arena/shared';
import { apiService } from '../services/apiService';
import { wsService } from '../services/wsService';

interface ArenaState {
    // Data
    agents: Agent[];
    leaderboard: LeaderboardEntry[];
    currentRound: number;

    // UI State
    isLoading: boolean;
    error: string | null;
    selectedAgent: Agent | null;

    // WebSocket
    wsConnected: boolean;

    // Actions
    fetchAgents: () => Promise<void>;
    fetchLeaderboard: () => Promise<void>;
    fetchAgent: (id: string) => Promise<Agent | null>;
    createAgent: (data: any) => Promise<any>;
    handleWsMessage: (message: WsMessage) => void;
    connectWebSocket: () => void;
    disconnectWebSocket: () => void;
    setSelectedAgent: (agent: Agent | null) => void;
}

export const useArenaStore = create<ArenaState>((set, get) => ({
    agents: [],
    leaderboard: [],
    currentRound: 0,
    isLoading: false,
    error: null,
    selectedAgent: null,
    wsConnected: false,

    fetchAgents: async () => {
        set({ isLoading: true, error: null });
        try {
            const agents = await apiService.getAgents();
            set({ agents, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchLeaderboard: async () => {
        try {
            const leaderboard = await apiService.getLeaderboard();
            set({ leaderboard });
        } catch (err) {
            console.error('Failed to fetch leaderboard:', err);
        }
    },

    fetchAgent: async (id: string) => {
        try {
            return await apiService.getAgent(id);
        } catch (err) {
            console.error('Failed to fetch agent:', err);
            return null;
        }
    },

    createAgent: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.createAgent(data);
            await get().fetchAgents();
            set({ isLoading: false });
            return response;
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    handleWsMessage: (message: WsMessage) => {
        switch (message.type) {
            case 'arena_update':
                const update = message.payload as SimulationUpdate;
                set((state) => ({
                    currentRound: update.round,
                    agents: state.agents.map(agent => {
                        const updated = update.agents.find(a => a.id === agent.id);
                        return updated ? { ...agent, score: updated.score, history: [...agent.history, updated.lastAction] } : agent;
                    }),
                }));
                break;
            case 'leaderboard_update':
                set({ leaderboard: message.payload });
                break;
            case 'agent_created':
                get().fetchAgents();
                break;
        }
    },

    connectWebSocket: () => {
        // DISABLED TEMPORARILY - WebSocket causing issues
        console.log('WebSocket disabled temporarily');
        set({ wsConnected: false });
    },

    //   connectWebSocket: () => {
    //     wsService.connect((message) => {
    //       get().handleWsMessage(message);
    //       set({ wsConnected: true });
    //     });
    //   },

    disconnectWebSocket: () => {
        wsService.disconnect();
        set({ wsConnected: false });
    },

    setSelectedAgent: (agent) => set({ selectedAgent: agent }),
}));