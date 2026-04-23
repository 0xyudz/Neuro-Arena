import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Wallet connect button component
import { useWallet } from '../hooks/useWallet';
export function WalletButton() {
    const { wallet, connect, disconnect, loading } = useWallet();
    if (wallet.connected && wallet.address) {
        return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-xs text-gray-400", children: "Connected" }), _jsxs("p", { className: "text-sm font-mono text-cyan-400", children: [wallet.address.slice(0, 4), "...", wallet.address.slice(-4)] })] }), _jsx("button", { onClick: disconnect, className: "px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 text-sm", children: "Disconnect" })] }));
    }
    return (_jsx("button", { onClick: connect, disabled: loading, className: "px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-black font-bold hover:opacity-90 disabled:opacity-50", children: loading ? 'Connecting...' : 'Connect Wallet' }));
}
//# sourceMappingURL=WalletButton.js.map