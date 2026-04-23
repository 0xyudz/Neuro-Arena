import { useState, useEffect, useCallback } from 'react';
import { agentApi } from '../shared/api';
import { Agent } from '../shared/types/agent';
export function useAgent(id) {
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchAgent = useCallback(async () => {
        if (!id)
            return;
        try {
            setLoading(true);
            setError(null);
            const data = await agentApi.getAgent(id);
            setAgent(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch agent');
            console.error('Fetch agent error:', err);
        }
        finally {
            setLoading(false);
        }
    }, [id]);
    useEffect(() => {
        fetchAgent();
    }, [fetchAgent]);
    return { agent, loading, error, refetch: fetchAgent };
}
export default useAgent;
//# sourceMappingURL=useAgent.js.map