// Agent creation logic hook
import { useState } from 'react';
import { bagsService } from '../services/bagsService';
import { api } from '../utils/api';
import { CreateAgentInput, Agent } from '../types';

export function useAgentCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgent = async (
    input: CreateAgentInput,
    owner: string
  ): Promise<Agent | null> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Launch token via Bags (mock or real)
      const tokenResult = await bagsService.launchToken({
        name: input.name,
        symbol: input.tokenSymbol,
        description: input.strategyPrompt,
      });

      if (!tokenResult.success) {
        throw new Error(tokenResult.error || 'Token launch failed');
      }

      // 2. Create agent record with token info
      const agentData = {
        ...input,
        owner,
        token: {
          symbol: input.tokenSymbol,
          name: input.name,
          mint: tokenResult.mint!,
          price: 0.01,
          supply: 1_000_000_000,
          launched: true,
        },
      };

      const response = await api.createAgent(agentData);
      
      if (!response.success) {
        throw new Error(response.error || 'Agent creation failed');
      }

      return response.agent;
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createAgent, loading, error };
}