import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export function Navbar() {
    const { publicKey, connected } = useWallet();
    const [unclaimed, setUnclaimed] = useState(0);
    const [claiming, setClaiming] = useState(false);
    useEffect(() => {
        if (connected && publicKey) {
            fetch(`${API_URL}/api/rewards/${publicKey.toString()}`)
                .then(r => r.json())
                .then(data => setUnclaimed(data.unclaimed || 0))
                .catch(() => { });
        }
    }, [connected, publicKey]);
    const handleClaim = async () => {
        if (!publicKey || claiming)
            return;
        setClaiming(true);
        try {
            const res = await fetch(`${API_URL}/api/rewards/claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userWallet: publicKey.toString() })
            });
            const data = await res.json();
            if (data.success) {
                alert(`✅ Claimed ${data.totalClaimed.toFixed(2)} tokens!`);
                setUnclaimed(0);
            }
        }
        finally {
            setClaiming(false);
        }
    };
    return (_jsx("nav", { className: "bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50", children: _jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [_jsx(Link, { to: "/", className: "text-xl font-bold text-white", children: "Agent Arena" }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx(Link, { to: "/arena", className: "text-gray-300 hover:text-white", children: "Arena" }), _jsx(Link, { to: "/marketplace", className: "text-gray-300 hover:text-white", children: "Marketplace" }), _jsx(Link, { to: "/leaderboard", className: "text-gray-300 hover:text-white", children: "Leaderboard" }), _jsx(Link, { to: "/profile", className: "text-gray-300 hover:text-white", children: "Profile" }), _jsx(Link, { to: "/create", className: "px-4 py-2 bg-cyan-500 text-black rounded", children: "Create Agent" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [connected && unclaimed > 0 && (_jsx("button", { onClick: handleClaim, disabled: claiming, className: "px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/30 transition disabled:opacity-50", children: claiming ? 'Claiming...' : `Claim ${unclaimed.toFixed(1)} 🎁` })), _jsx(WalletMultiButton, {})] })] }) }));
}
//# sourceMappingURL=Navbar.js.map