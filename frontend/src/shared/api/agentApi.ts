import apiClient from './client';
import { Agent, CreateAgentPayload, AgentsResponse, AgentResponse } from '../types/agent';

export const agentApi = {
  // GET /api/agents - List all agents
  getAgents: async (): Promise<Agent[]> => {
    const response = await apiClient.get<AgentsResponse>('/api/agents');
    return response.data.agents;
  },

  // GET /api/agents/:id - Get single agent
  getAgent: async (id: string): Promise<Agent> => {
    const response = await apiClient.get<AgentResponse>(`/api/agents/${id}`);
    return response.data.agent;
  },

  // POST /api/agents - Create new agent
  createAgent: async (payload: CreateAgentPayload): Promise<Agent> => {
    const response = await apiClient.post<AgentResponse>('/api/agents', payload);
    return response.data.agent;
  },

  // POST /api/agents/:id/boost - Boost agent score
  boostAgent: async (id: string): Promise<Agent> => {
    const response = await apiClient.post<AgentResponse>(`/api/agents/${id}/boost`);
    return response.data.agent;
  },

  // POST /api/buy - Buy agent token
  buyToken: async (agentId: string, amount: number): Promise<Agent> => {
    const response = await apiClient.post<AgentResponse>('/api/buy', { agentId, amount });
    return response.data.agent;
  },

  // POST /api/sell - Sell agent token
  sellToken: async (agentId: string, amount: number): Promise<Agent> => {
    const response = await apiClient.post<AgentResponse>('/api/sell', { agentId, amount });
    return response.data.agent;
  },

  // GET /api/battle/logs - Get battle logs
  getBattleLogs: async (): Promise<BattleLog[]> => {
    const response = await apiClient.get<{ logs: BattleLog[] }>('/api/battle/logs');
    return response.data.logs;
  },
};

interface BattleLog {
  id: string;
  agentId: string;
  agentName: string;
  reason: string;
  scoreDelta: number;
  timestamp: number;
}

export default agentApi;