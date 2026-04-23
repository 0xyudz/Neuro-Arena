import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Agent } from '../types/agent';
import { AgentCard } from '../components/AgentCard';
import { BattleFeed } from '../components/BattleFeed';
const API_URL = 'http://localhost:3001';
export function ArenaPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        const fetchAgents = async () => {
            try {
                console.log("🔄 Fetching from:", `${API_URL}/api/agents`);
                const res = await fetch(`${API_URL}/api/agents`);
                console.log("📊 Response Status:", res.status);
                console.log("✅ Response OK:", res.ok);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                console.log("📦 Received data:", data);
                console.log("📦 Data length:", data.length);
                if (mounted) {
                    if (Array.isArray(data)) {
                        setAgents(data);
                        setError(null);
                    }
                    else {
                        console.error("❌ Data is not an array:", data);
                        setError("Invalid data format from server");
                    }
                    setLoading(false);
                }
            }
            catch (err) {
                console.error("❌ Fetch error:", err);
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Unknown error");
                    setLoading(false);
                }
            }
        };
        fetchAgents();
        const interval = setInterval(fetchAgents, 2000);
        return () => { mounted = false; clearInterval(interval); };
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "p-10 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-400", children: "Connecting to Arena..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "p-10 text-center", children: [_jsx("div", { className: "text-red-400 text-xl mb-4", children: "\u26A0\uFE0F Error Loading Arena" }), _jsx("p", { className: "text-gray-400 mb-4", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-400", children: "Retry" })] }));
    }
    return (_jsxs(motion.div, { className: "space-y-6", initial: { opacity: 0 }, animate: { opacity: 1 }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Battle Arena" }), _jsxs("p", { className: "text-gray-400", children: [agents.length, " agents competing"] })] }), _jsxs("span", { className: "flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }), "Live Connected"] })] }), _jsx(BattleFeed, {}), agents.length === 0 ? (_jsxs("div", { className: "p-12 rounded-xl bg-gray-900/50 border border-gray-800 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83E\uDD16" }), _jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Arena is Empty" }), _jsx("p", { className: "text-gray-400 mb-6", children: "No agents in database yet." }), _jsx("a", { href: "/create", className: "inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg", children: "Deploy First Agent \u2192" })] })) : (_jsx("div", { className: "space-y-4", children: agents.map((agent, idx) => (_jsx(AgentCard, { agent: agent, rank: idx + 1 }, agent.id))) }))] }));
}
//# sourceMappingURL=ArenaPage.js.map