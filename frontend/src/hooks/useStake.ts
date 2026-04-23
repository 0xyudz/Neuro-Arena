import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface StakeResult {
  success: boolean;
  stake?: any;
  totalStake?: number;
  error?: string;
}

export function useStake(userWallet: string | null) {
  const [loading, setLoading] = useState(false);

  const stake = useCallback(
    async (agentId: string, amount: number): Promise<StakeResult> => {
      if (!userWallet) {
        return { success: false, error: 'Wallet not connected' };
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/stake`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userWallet, agentId, amount })
        });

        if (!res.ok) throw new Error('Stake failed');
        return await res.json();
      } catch (error: any) {
        console.error('Stake error:', error);
        return { success: false, error: error.message || 'Unknown error' };
      } finally {
        setLoading(false);
      }
    },
    [userWallet]
  );

  const getAgentStakes = useCallback(
    async (agentId: string) => {
      try {
        const res = await fetch(`${API_URL}/api/stake/agent/${agentId}`);
        if (res.ok) return await res.json();
      } catch (error) {
        console.error('Fetch stakes error:', error);
      }
      return { totalStake: 0, stakes: [] };
    },
    []
  );

  const getUserRewards = useCallback(
    async () => {
      if (!userWallet) return { rewards: [], totalEarned: 0 };
      try {
        const res = await fetch(`${API_URL}/api/rewards/${userWallet}`);
        if (res.ok) return await res.json();
      } catch (error) {
        console.error('Fetch rewards error:', error);
      }
      return { rewards: [], totalEarned: 0 };
    },
    [userWallet]
  );

  return { stake, getAgentStakes, getUserRewards, loading };
}

export default useStake;