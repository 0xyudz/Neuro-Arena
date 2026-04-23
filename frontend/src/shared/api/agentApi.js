import apiClient from './client';
import { Agent, CreateAgentPayload, AgentsResponse, AgentResponse } from '../types/agent';
export const agentApi = {
    // GET /api/agents - List all agents
    getAgents: async () => {
        const response = await apiClient.get('/api/agents');
        return response.data.agents;
    },
    // GET /api/agents/:id - Get single agent
    getAgent: async (id) => {
        const response = await apiClient.get(`/api/agents/${id}`);
        return response.data.agent;
    },
    // POST /api/agents - Create new agent
    createAgent: async (payload) => {
        const response = await apiClient.post('/api/agents', payload);
        return response.data.agent;
    },
    // POST /api/agents/:id/boost - Boost agent score
    boostAgent: async (id) => {
        const response = await apiClient.post(`/api/agents/${id}/boost`);
        return response.data.agent;
    },
    // POST /api/buy - Buy agent token
    buyToken: async (agentId, amount) => {
        const response = await apiClient.post('/api/buy', { agentId, amount });
        return response.data.agent;
    },
    // POST /api/sell - Sell agent token
    sellToken: async (agentId, amount) => {
        const response = await apiClient.post('/api/sell', { agentId, amount });
        return response.data.agent;
    },
    // GET /api/battle/logs - Get battle logs
    getBattleLogs: async () => {
        const response = await apiClient.get('/api/battle/logs');
        return response.data.logs;
    },
};
export default agentApi;
//# sourceMappingURL=agentApi.js.map