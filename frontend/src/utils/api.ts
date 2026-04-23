import { API_BASE_URL } from './constants';
import { Agent, UserBalance, RewardPool, StakeRequest } from '../types';

export const api = {
  async getAgents(): Promise<Agent[]> {
    const res = await fetch(`${API_BASE_URL}/agents`);
    const data = await res.json();
    return data.agents || [];
  },

  async createAgent(agent: Partial<Agent>): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...agent,
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`,
      }),
    });
    return res.json();
  },

  async getUserBalance(userId: string): Promise<number> {
    const res = await fetch(`${API_BASE_URL}/user/${userId}/balance`);
    const data: UserBalance = await res.json();
    return data.balance;
  },

  async getRewardPool(): Promise<RewardPool> {
    const res = await fetch(`${API_BASE_URL}/reward-pool`);
    return res.json();
  },

  async stake(request: StakeRequest): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/stake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return res.json();
  },
};