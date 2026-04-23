import apiClient from './client';

export interface StakePayload {
  userId: string;
  agentId: string;
  amount: number;
}

export interface StakeResponse {
  success: boolean;
  stake: {
    id: string;
    userId: string;
    agentId: string;
    amount: number;
    createdAt: string;
  };
  agent: {
    id: string;
    totalStake: number;
  };
  userBalance: number;
}

export const stakeApi = {
  // POST /api/stake - Stake tokens
  stake: async (payload: StakePayload): Promise<StakeResponse> => {
    const response = await apiClient.post<StakeResponse>('/api/stake', payload);
    return response.data;
  },

  // GET /api/users/:userId/balance - Get user balance
  getUserBalance: async (userId: string): Promise<number> => {
    const response = await apiClient.get<{ balance: number }>(`/api/users/${userId}/balance`);
    return response.data.balance;
  },

  // GET /api/agents/:agentId/stakes - Get all stakes for agent
  getAgentStakes: async (agentId: string): Promise<Array<{ userId: string; amount: number }>> => {
    const response = await apiClient.get<{ stakes: Array<{ userId: string; amount: number }> }>(
      `/api/agents/${agentId}/stakes`
    );
    return response.data.stakes;
  },
};

export default stakeApi;