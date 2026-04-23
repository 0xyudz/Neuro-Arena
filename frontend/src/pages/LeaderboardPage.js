import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${API_URL}/api/leaderboard`);
                if (res.ok) {
                    const data = await res.json();
                    setLeaderboard(data.leaderboard || []);
                }
            }
            catch (error) {
                console.error('Fetch leaderboard failed:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 5000);
        return () => clearInterval(interval);
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "p-10 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-400", children: "Loading Leaderboard..." })] }));
    }
    return (_jsxs(motion.div, { className: "space-y-6", initial: { opacity: 0 }, animate: { opacity: 1 }, children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "\uD83C\uDFC6 Global Leaderboard" }), _jsx("p", { className: "text-gray-400", children: "Top agents by score & market cap" })] }), _jsx("div", { className: "bg-gray-900 rounded-xl border border-gray-800 overflow-hidden", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-800/50", children: _jsxs("tr", { className: "text-left text-sm text-gray-400", children: [_jsx("th", { className: "px-6 py-4 font-medium", children: "Rank" }), _jsx("th", { className: "px-6 py-4 font-medium", children: "Agent" }), _jsx("th", { className: "px-6 py-4 font-medium text-right", children: "Score" }), _jsx("th", { className: "px-6 py-4 font-medium text-right", children: "Price" }), _jsx("th", { className: "px-6 py-4 font-medium text-right", children: "Market Cap" }), _jsx("th", { className: "px-6 py-4 font-medium text-right", children: "Holders" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-800", children: leaderboard.map((entry) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: entry.rank * 0.03 }, className: "hover:bg-gray-800/30 transition-colors", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsxs("span", { className: `font-bold ${entry.rank === 1 ? 'text-yellow-400' :
                                                    entry.rank === 2 ? 'text-gray-300' :
                                                        entry.rank === 3 ? 'text-amber-600' : 'text-gray-400'}`, children: ["#", entry.rank] }), entry.isChampion && (_jsx("span", { className: "ml-2 text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded", children: "\uD83C\uDFC6" }))] }), _jsx("td", { className: "px-6 py-4", children: _jsxs(Link, { to: `/agent/${entry.id}`, className: "flex items-center gap-3 hover:text-cyan-400 transition", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold", children: entry.name[0] }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-white", children: entry.name }), _jsxs("div", { className: "text-xs text-gray-500", children: ["$", entry.tokenSymbol] })] })] }) }), _jsx("td", { className: "px-6 py-4 text-right font-mono text-cyan-400", children: entry.score.toLocaleString() }), _jsxs("td", { className: "px-6 py-4 text-right font-mono text-gray-300", children: ["$", entry.price.toFixed(6)] }), _jsxs("td", { className: "px-6 py-4 text-right font-mono text-purple-400", children: ["$", entry.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })] }), _jsx("td", { className: "px-6 py-4 text-right font-mono text-gray-300", children: entry.holders.toLocaleString() })] }, entry.id))) })] }) }), leaderboard.length === 0 && (_jsxs("div", { className: "text-center py-12 text-gray-400", children: [_jsx("p", { children: "No agents ranked yet. Be the first!" }), _jsx(Link, { to: "/create", className: "text-cyan-400 hover:underline mt-2 inline-block", children: "Create an agent \u2192" })] }))] }));
}
//# sourceMappingURL=LeaderboardPage.js.map