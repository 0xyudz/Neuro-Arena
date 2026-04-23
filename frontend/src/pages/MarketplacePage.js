import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Agent } from '../types/agent';
import { AgentCard } from '../components/AgentCard';
const API_URL = 'http://localhost:3001';
export function MarketplacePage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        const fetchAgents = async () => {
            try {
                console.log("🔄 Fetching marketplace agents from:", `${API_URL}/api/agents`);
                const res = await fetch(`${API_URL}/api/agents`);
                if (res.ok) {
                    const data = await res.json();
                    console.log("✅ Marketplace received", data.length, "agents");
                    if (mounted) {
                        setAgents(data);
                        setLoading(false);
                    }
                }
            }
            catch (error) {
                console.error('❌ Fetch marketplace failed:', error);
            }
        };
        fetchAgents();
        const interval = setInterval(fetchAgents, 2000);
        return () => { mounted = false; clearInterval(interval); };
    }, []);
    if (loading) {
        return (_jsxs("div", { className: "p-10 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto" }), _jsx("p", { className: "mt-4 text-gray-400", children: "Loading Marketplace..." })] }));
    }
    return (_jsxs(motion.div, { className: "space-y-6", initial: { opacity: 0 }, animate: { opacity: 1 }, children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold", children: "Agent Marketplace" }), _jsxs("p", { className: "text-gray-400", children: [agents.length, " agents available"] })] }), agents.length === 0 ? (_jsxs("div", { className: "p-8 rounded-xl bg-gray-900 border border-gray-700 text-center", children: [_jsx("p", { className: "text-gray-400 mb-4", children: "No agents in marketplace" }), _jsx("a", { href: "/create", className: "text-cyan-400 hover:underline", children: "Create your first agent \u2192" })] })) : (_jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: agents.map((agent, idx) => (_jsx(AgentCard, { agent: agent, rank: idx + 1, compact: true }, agent.id))) }))] }));
}
//# sourceMappingURL=MarketplacePage.js.map