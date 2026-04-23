import apiClient from './client';
export const stakeApi = {
    // POST /api/stake - Stake tokens
    stake: async (payload) => {
        const response = await apiClient.post('/api/stake', payload);
        return response.data;
    },
    // GET /api/users/:userId/balance - Get user balance
    getUserBalance: async (userId) => {
        const response = await apiClient.get(`/api/users/${userId}/balance`);
        return response.data.balance;
    },
    // GET /api/agents/:agentId/stakes - Get all stakes for agent
    getAgentStakes: async (agentId) => {
        const response = await apiClient.get(`/api/agents/${agentId}/stakes`);
        return response.data.stakes;
    },
};
export default stakeApi;
//# sourceMappingURL=stakeApi.js.map