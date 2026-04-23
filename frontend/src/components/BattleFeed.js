import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
// ✅ PASTIKAN INI 3001
const API_URL = import.meta.env.VITE_API_URL || 'https://neuroarena.onrender.com';
export function BattleFeed() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch(`${API_URL}/api/battle/logs`);
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data.slice(0, 5));
                }
            }
            catch (error) {
                console.error('Failed to fetch logs:', error);
            }
        };
        fetchLogs();
        const interval = setInterval(fetchLogs, 2000);
        return () => clearInterval(interval);
    }, []);
    if (logs.length === 0)
        return null;
    return (_jsxs("div", { className: "bg-gray-900/50 p-4 rounded-xl border border-gray-800", children: [_jsxs("h3", { className: "text-sm font-bold text-gray-400 mb-3 uppercase flex items-center gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-red-500 animate-pulse" }), "Live Battle Feed"] }), _jsx("div", { className: "space-y-2", children: logs.map((log) => (_jsxs("div", { className: "flex items-center gap-3 text-sm bg-gray-800/30 p-2 rounded border-l-2 border-cyan-500/30", children: [_jsx("span", { className: "text-xs text-gray-500 font-mono", children: new Date(log.timestamp).toLocaleTimeString() }), _jsx("span", { className: "font-medium text-gray-200", children: log.reason }), _jsxs("span", { className: `ml-auto text-xs font-bold px-2 py-0.5 rounded ${log.scoreDelta > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`, children: [log.scoreDelta > 0 ? '+' : '', log.scoreDelta] })] }, log.id))) })] }));
}
//# sourceMappingURL=BattleFeed.js.map