import axios from 'axios';
import { Agent, CreateAgentRequest, CreateAgentResponse, LeaderboardEntry } from '@agent-arena/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const apiService = {
  async getAgents(): Promise<Agent[]> {
    const { data } = await api.get('/agents');
    return data.agents;
  },
  
  async getAgent(id: string): Promise<Agent> {
    const { data } = await api.get(`/agents/${id}`);
    return data.agent;
  },
  
  async createAgent(data: CreateAgentRequest): Promise<CreateAgentResponse> {
    const { data: response } = await api.post('/agents', data);
    return response;
  },
  
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data } = await api.get('/leaderboard');
    return data.leaderboard;
  },
  
  async simulate(): Promise<void> {
    await api.post('/simulate');
  },
};