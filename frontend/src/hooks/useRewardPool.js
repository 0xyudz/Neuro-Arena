import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { RewardPool } from '../types';
const defaultPool = {
    poolSize: 100,
    totalStaked: 0,
    nextDistribution: new Date().toISOString(),
};
export function useRewardPool() {
    const [pool, setPool] = useState(defaultPool);
    const fetchPool = async () => {
        try {
            const data = await api.getRewardPool();
            setPool(data);
        }
        catch (err) {
            console.error('Failed to fetch reward pool:', err);
        }
    };
    useEffect(() => {
        fetchPool();
        const interval = setInterval(fetchPool, 5000);
        return () => clearInterval(interval);
    }, []);
    return pool;
}
//# sourceMappingURL=useRewardPool.js.map