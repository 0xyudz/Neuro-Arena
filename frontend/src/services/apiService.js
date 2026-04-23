import axios from 'axios';
import { Agent, CreateAgentRequest, CreateAgentResponse, LeaderboardEntry } from '@agent-arena/shared';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});
export const apiService = {
    async getAgents() {
        const { data } = await api.get('/agents');
        return data.agents;
    },
    async getAgent(id) {
        const { data } = await api.get(`/agents/${id}`);
        return data.agent;
    },
    async createAgent(data) {
        const { data: response } = await api.post('/agents', data);
        return response;
    },
    async getLeaderboard() {
        const { data } = await api.get('/leaderboard');
        return data.leaderboard;
    },
    async simulate() {
        await api.post('/simulate');
    },
};
//# sourceMappingURL=apiService.js.map