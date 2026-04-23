import { jsx as _jsx } from "react/jsx-runtime";
import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
export const SolanaProvider = ({ children }) => {
    const endpoint = process.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
    ], []);
    return (_jsx(ConnectionProvider, { endpoint: endpoint, children: _jsx(SolanaWalletProvider, { wallets: wallets, autoConnect: true, children: _jsx(WalletModalProvider, { children: children }) }) }));
};
//# sourceMappingURL=SolanaProvider.js.map