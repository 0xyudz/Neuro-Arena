import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { shortenWallet } from '../lib/agents/wallet';
export function WalletDisplay({ address, label = 'Wallet', className = '' }) {
    return (_jsxs("div", { className: `flex items-center gap-2 ${className}`, children: [_jsxs("span", { className: "text-xs text-gray-400", children: [label, ":"] }), _jsx("span", { className: "text-xs font-mono text-cyan-400", children: shortenWallet(address) })] }));
}
//# sourceMappingURL=WalletDisplay.js.map