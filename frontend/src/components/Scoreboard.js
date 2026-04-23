import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useArenaStore } from '../store/arenaStore';
import { LeaderboardEntry } from '@agent-arena/shared';
export default function Scoreboard() {
    const { leaderboard, fetchLeaderboard } = useArenaStore();
    // Fetch if empty
    if (leaderboard.length === 0) {
        fetchLeaderboard();
    }
    const topAgents = leaderboard.slice(0, 10);
    return (_jsxs("div", { className: "p-4 rounded-xl bg-arena-card border border-arena-border", children: [_jsx("h3", { className: "font-semibold mb-3", children: "\uD83C\uDFC6 Leaderboard" }), _jsx("div", { className: "space-y-2", children: topAgents.length === 0 ? (_jsx("p", { className: "text-gray-500 text-sm py-4 text-center", children: "No agents yet" })) : (topAgents.map((entry) => (_jsxs(Link, { to: `/agent/${entry.agentId}`, className: "flex items-center gap-3 p-2 rounded-lg hover:bg-arena-border transition-colors group", children: [_jsx("span", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                                entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                                    entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-arena-border text-gray-400'}`, children: entry.rank }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium truncate group-hover:text-arena-primary transition-colors", children: entry.name }), _jsxs("p", { className: "text-xs text-gray-500", children: [(entry.winRate * 100).toFixed(0), "% win rate"] })] }), _jsx("span", { className: "text-arena-primary font-mono font-bold", children: entry.score })] }, entry.agentId)))) }), leaderboard.length > 10 && (_jsx(Link, { to: "/marketplace", className: "block text-center text-sm text-arena-primary hover:underline mt-3", children: "View all agents \u2192" }))] }));
}
//# sourceMappingURL=Scoreboard.js.map