// Wallet connection hook
import { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { WalletState } from '../types';
export function useWallet() {
    const [wallet, setWallet] = useState({
        connected: false,
        address: null,
        balance: 0,
    });
    const [loading, setLoading] = useState(false);
    const connect = async () => {
        setLoading(true);
        const address = await walletService.connect();
        if (address) {
            const balance = await walletService.getBalance(address);
            setWallet({ connected: true, address, balance });
            localStorage.setItem('wallet_address', address);
        }
        setLoading(false);
        return !!address;
    };
    const disconnect = async () => {
        await walletService.disconnect();
        setWallet({ connected: false, address: null, balance: 0 });
        localStorage.removeItem('wallet_address');
    };
    // Restore session on mount
    useEffect(() => {
        const saved = localStorage.getItem('wallet_address');
        if (saved) {
            walletService.getBalance(saved).then(balance => {
                setWallet({ connected: true, address: saved, balance });
            });
        }
    }, []);
    return { wallet, connect, disconnect, loading };
}
//# sourceMappingURL=useWallet.js.map