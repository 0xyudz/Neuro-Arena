import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { MOCK_USER_ID } from '../utils/constants';
export function useUserBalance() {
    const [balance, setBalance] = useState(1000);
    const [loading, setLoading] = useState(false);
    const fetchBalance = async () => {
        try {
            const data = await api.getUserBalance(MOCK_USER_ID);
            setBalance(data);
        }
        catch (err) {
            console.error('Failed to fetch balance:', err);
        }
    };
    useEffect(() => {
        fetchBalance();
    }, []);
    const updateBalance = (newBalance) => {
        setBalance(newBalance);
    };
    return { balance, loading, updateBalance, refetch: fetchBalance };
}
//# sourceMappingURL=useUserBalance.js.map