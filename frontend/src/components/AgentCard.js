import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Agent, ServiceEndpoint } from '../types/agent';
import { shortenWallet } from '../lib/agents/wallet';
// ✅ NEW: AI Personality Helper
function getAgentPersonality(agent) {
    const strategy = agent.strategy || 'balanced';
    const confidence = agent.runtime?.confidence ?? agent.confidence ?? 0.5;
    const winStreak = agent.runtime?.winStreak ?? agent.winStreak ?? 0;
    const loseStreak = agent.runtime?.loseStreak ?? agent.loseStreak ?? 0;
    if (strategy === 'aggressive' && confidence > 0.7 && winStreak >= 2)
        return 'Alpha Predator';
    if (strategy === 'defensive' && confidence < 0.4)
        return 'Cautious Survivor';
    if (loseStreak >= 3)
        return 'Underdog Fighter';
    if (winStreak >= 3)
        return 'Rising Champion';
    if (strategy === 'balanced')
        return 'Adaptive Strategist';
    if (strategy === 'aggressive')
        return 'Bold Attacker';
    if (strategy === 'defensive')
        return 'Steady Defender';
    return 'Emerging Agent';
}
export function AgentCard({ agent, rank, compact = false }) {
    const [flash, setFlash] = useState(null);
    const isTop = rank === 1;
    const metadata = agent.metadata || agent;
    const name = metadata?.name || `Agent ${agent.id?.slice(0, 4)}`;
    const services = metadata?.services || [];
    const wallet = agent.agentWallet || '';
    const score = agent.runtime?.score || 0;
    const lastAction = agent.runtime?.lastAction;
    const isChampion = agent.runtime?.isChampion;
    // ✅ NEW: AI State
    const strategy = agent.strategy || metadata?.strategy || 'balanced';
    const recentTrend = agent.recentTrend || 'stable';
    const personality = getAgentPersonality(agent);
    const token = agent.token;
    const holders = token?.holders || 0;
    const isCommunityPowered = holders >= 25;
    const price = token?.price ?? 0;
    const marketCap = token?.marketCap ?? 0;
    const priceChange = token?.priceChange ?? 0;
    useEffect(() => {
        if (lastAction === 'win' || lastAction === 'lose') {
            setFlash(lastAction);
            const t = setTimeout(() => setFlash(null), 1500);
            return () => clearTimeout(t);
        }
    }, [lastAction]);
    const flashClass = flash === 'win' ? 'ring-2 ring-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
        : flash === 'lose' ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
            : isChampion ? 'ring-2 ring-yellow-500/50' : '';
    // ✅ NEW: Trend color
    const trendColor = recentTrend === 'hot' ? 'text-red-400' :
        recentTrend === 'cold' ? 'text-blue-400' : 'text-gray-400';
    // ✅ NEW: Strategy badge color
    const strategyColor = strategy === 'aggressive' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
        strategy === 'defensive' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
            'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (compact) {
        return (_jsx(Link, { to: `/agent/${agent.id}`, className: "block group", children: _jsxs("div", { className: `flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition relative ${flashClass}`, children: [isChampion && _jsx("span", { className: "absolute -top-2 -right-2 text-lg animate-bounce", children: "\uD83C\uDFC6" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: `w-8 h-8 rounded flex items-center justify-center text-xs font-bold relative ${isTop ? 'bg-yellow-500 text-black' : 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white'}`, children: [isTop ? '👑' : name[0], lastAction === 'win' && _jsx("span", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[8px] flex items-center justify-center font-bold", children: "\u2713" }), lastAction === 'lose' && _jsx("span", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold", children: "\u2717" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm truncate max-w-[100px] group-hover:text-cyan-400 transition", children: name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "text-xs text-gray-500", children: shortenWallet(wallet) }), token && _jsxs("span", { className: `text-[10px] font-mono ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`, children: [priceChange >= 0 ? '+' : '', priceChange.toFixed(2), "%"] })] }), _jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [_jsx("span", { className: `text-[9px] px-1 py-0.5 rounded border ${strategyColor} capitalize`, children: strategy }), recentTrend !== 'stable' && (_jsx("span", { className: `text-[9px] ${trendColor}`, children: "\u25CF" }))] })] })] }), token && (_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-gray-500 text-xs", children: "Holders" }), _jsxs("p", { className: "text-sm font-mono text-orange-400", children: ["\uD83D\uDC65 ", holders] })] }))] }) }));
    }
    return (_jsxs("div", { className: `p-5 rounded-xl border transition-all relative bg-gray-900 border-gray-800 ${flashClass} ${isChampion ? 'bg-yellow-500/5' : ''}`, children: [isChampion && _jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full shadow-lg", children: "\uD83C\uDFC6 CHAMPION" }), _jsx("div", { className: "flex items-start justify-between mb-4 pt-2", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold relative ${isTop ? 'bg-yellow-500 text-black' : 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white'}`, children: [isTop ? '👑' : score.toFixed(0), lastAction === 'win' && _jsx("span", { className: "absolute -bottom-1 -right-1 px-2 py-0.5 bg-green-500 rounded text-[10px] font-bold text-white shadow-sm", children: "WIN" }), lastAction === 'lose' && _jsx("span", { className: "absolute -bottom-1 -right-1 px-2 py-0.5 bg-red-500 rounded text-[10px] font-bold text-white shadow-sm", children: "LOSE" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-bold text-lg", children: name }), isCommunityPowered && _jsx("span", { className: "text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-orange-400 text-black rounded font-bold animate-pulse", children: "\uD83D\uDD25 VIRAL" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1", children: [_jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded border capitalize font-medium ${strategyColor}`, children: strategy }), _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400", children: personality }), recentTrend !== 'stable' && (_jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded font-bold ${recentTrend === 'hot' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                                                'bg-blue-900/30 text-blue-400 border border-blue-500/30'}`, children: recentTrend === 'hot' ? '🔥 HOT' : '❄️ COLD' })), services.map((s, i) => _jsx("span", { className: "text-[10px] px-1.5 py-0.5 rounded bg-purple-900/50 border border-purple-500/30 text-purple-300 uppercase font-bold", children: s.name }, i)), token && _jsxs("span", { className: `text-[10px] px-1.5 py-0.5 rounded font-bold ${priceChange >= 0 ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`, children: [token.symbol, " ", priceChange >= 0 ? '+' : '', priceChange.toFixed(1), "%"] })] })] })] }) }), _jsxs("div", { className: "grid grid-cols-3 gap-3 text-sm mb-4", children: [_jsxs("div", { className: "bg-gray-800/50 p-2 rounded-lg", children: [_jsx("span", { className: "text-gray-500 block text-xs", children: "Price" }), _jsx("span", { className: `font-mono ${token ? 'text-cyan-400' : 'text-gray-600'}`, children: token ? `$${price.toFixed(6)}` : '-' })] }), _jsxs("div", { className: "bg-gray-800/50 p-2 rounded-lg", children: [_jsx("span", { className: "text-gray-500 block text-xs", children: "MCap" }), _jsx("span", { className: `font-mono ${token ? 'text-purple-400' : 'text-gray-600'}`, children: token ? `$${(marketCap / 1000).toFixed(1)}k` : '-' })] }), _jsxs("div", { className: "bg-gray-800/50 p-2 rounded-lg", children: [_jsx("span", { className: "text-gray-500 block text-xs", children: "Holders" }), _jsxs("span", { className: "font-mono text-orange-400", children: ["\uD83D\uDC65 ", holders] })] })] }), _jsx(Link, { to: `/agent/${agent.id}`, className: "block text-center py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition", children: token ? 'Trade / View' : 'Launch Token' })] }));
}
//# sourceMappingURL=AgentCard.js.map