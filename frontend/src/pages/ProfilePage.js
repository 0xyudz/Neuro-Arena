import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export function ProfilePage() {
    const { publicKey, connected } = useWallet();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    useEffect(() => {
        if (!connected || !publicKey)
            return;
        const wallet = publicKey.toString();
        Promise.all([
            fetch(`${API_URL}/api/rewards/${wallet}`).then(r => r.json()),
            fetch(`${API_URL}/api/stake/user/${wallet}`).then(r => r.json()),
            fetch(`${API_URL}/api/agents`).then(r => r.json())
        ]).then(([rewardsData, stakesData, allAgents]) => {
            // Calculate best performing agent
            const userAgents = allAgents.filter((a) => a.ownerWallet === wallet);
            const bestAgent = userAgents.reduce((best, current) => {
                const currentRate = current.wins / (current.wins + current.losses || 1);
                const bestRate = best?.wins / (best?.wins + best?.losses || 1);
                return currentRate > bestRate ? current : best;
            }, null);
            // Calculate staked agents win rate
            const stakedAgents = stakesData.stakes?.map((s) => allAgents.find((a) => a.id === s.agentId)).filter(Boolean);
            const totalWins = stakedAgents?.reduce((sum, a) => sum + (a.wins || 0), 0) || 0;
            const totalLosses = stakedAgents?.reduce((sum, a) => sum + (a.losses || 0), 0) || 0;
            const stakedWinRate = totalWins + totalLosses > 0
                ? (totalWins / (totalWins + totalLosses)) * 100
                : 0;
            setData({
                rewards: rewardsData,
                stakes: stakesData,
                bestAgent,
                totalRewards: rewardsData.totalRewards || 0,
                stakedWinRate
            });
            setLoading(false);
        }).catch(err => {
            console.error('Profile fetch error:', err);
            setLoading(false);
        });
    }, [connected, publicKey]);
    if (!connected)
        return _jsx("div", { className: "p-10 text-center text-gray-400", children: "Please connect wallet to view profile." });
    if (loading)
        return _jsx("div", { className: "p-10 text-center text-gray-400", children: "Loading profile..." });
    // ✅ FIX: Destructure ALL variables from data
    const { rewards, stakes, bestAgent, totalRewards, stakedWinRate } = data || {};
    const totalStaked = stakes?.stakes?.reduce((sum, s) => sum + s.amount, 0) || 0;
    const unclaimed = rewards?.unclaimed || 0;
    return (_jsxs(motion.div, { className: "space-y-6 max-w-4xl mx-auto", initial: { opacity: 0 }, animate: { opacity: 1 }, children: [_jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-800", children: [_jsx("h1", { className: "text-2xl font-bold mb-1", children: "Wallet Profile" }), _jsx("p", { className: "text-gray-400 font-mono text-sm break-all", children: publicKey?.toString() || 'Not connected' })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "bg-gray-900 p-4 rounded-xl border border-gray-800", children: [_jsx("p", { className: "text-gray-400 text-xs mb-1", children: "Best Agent" }), _jsx("p", { className: "font-bold text-cyan-400 truncate", children: bestAgent?.name || '—' }), _jsxs("p", { className: "text-xs text-gray-500", children: [bestAgent?.wins || 0, "W / ", bestAgent?.losses || 0, "L"] })] }), _jsxs("div", { className: "bg-gray-900 p-4 rounded-xl border border-gray-800", children: [_jsx("p", { className: "text-gray-400 text-xs mb-1", children: "Total Earned" }), _jsxs("p", { className: "font-bold text-green-400", children: [totalRewards?.toFixed(2) || '0.00', " \uD83E\uDE99"] })] }), _jsxs("div", { className: "bg-gray-900 p-4 rounded-xl border border-gray-800", children: [_jsx("p", { className: "text-gray-400 text-xs mb-1", children: "Staked Win Rate" }), _jsxs("p", { className: "font-bold text-purple-400", children: [stakedWinRate?.toFixed(1) || '0', "%"] })] })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gray-900 p-4 rounded-xl border border-gray-800 text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Total Staked" }), _jsx("p", { className: "text-xl font-bold text-cyan-400", children: totalStaked.toFixed(2) })] }), _jsxs("div", { className: "bg-gray-900 p-4 rounded-xl border border-gray-800 text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Total Rewards" }), _jsx("p", { className: "text-xl font-bold text-purple-400", children: (totalRewards || 0).toFixed(2) })] }), _jsxs("div", { className: "bg-gray-900 p-4 rounded-xl border border-gray-800 text-center", children: [_jsx("p", { className: "text-gray-400 text-sm", children: "Unclaimed" }), _jsx("p", { className: "text-xl font-bold text-green-400", children: unclaimed.toFixed(2) })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-800", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Active Stakes" }), stakes?.stakes?.length === 0 ? _jsx("p", { className: "text-gray-500", children: "No active stakes" }) : (_jsx("div", { className: "space-y-3", children: stakes?.stakes?.map((s, i) => (_jsxs("div", { className: "flex justify-between items-center bg-gray-800/50 p-3 rounded-lg", children: [_jsxs(Link, { to: `/agent/${s.agent?.id}`, className: "text-cyan-400 hover:underline font-medium", children: [s.agent?.name || 'Unknown', " (", s.agent?.tokenSymbol || '?', ")"] }), _jsx("span", { className: "font-mono text-gray-300", children: s.amount.toFixed(2) })] }, i))) }))] }), _jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-800", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Recent Rewards" }), rewards?.rewards?.length === 0 ? _jsx("p", { className: "text-gray-500", children: "No rewards yet" }) : (_jsx("div", { className: "space-y-3 max-h-64 overflow-y-auto pr-1", children: rewards?.rewards?.map((r, i) => (_jsxs("div", { className: "flex justify-between items-center bg-gray-800/50 p-3 rounded-lg", children: [_jsx("span", { className: "text-gray-300", children: r.agent?.name || 'Unknown' }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-xs px-2 py-0.5 rounded ${r.claimed ? 'bg-gray-700 text-gray-400' : 'bg-green-900/30 text-green-400'}`, children: r.claimed ? 'Claimed' : 'Pending' }), _jsxs("span", { className: "font-mono text-green-400", children: ["+", r.amount.toFixed(2)] })] })] }, i))) }))] })] })] }));
}
//# sourceMappingURL=ProfilePage.js.map