import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Agent } from '../types/agent';
import { shortenWallet } from '../lib/agents/wallet';
import { useWallet } from '@solana/wallet-adapter-react';
const API_URL = import.meta.env.VITE_API_URL || 'https://neuroarena.onrender.com';
export function AgentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agent, setAgent] = useState(null);
    const [tradeAmount, setTradeAmount] = useState(1000);
    const [loading, setLoading] = useState(false);
    // ✅ NEW: User position state
    const { publicKey, connected } = useWallet();
    const [userStats, setUserStats] = useState({
        totalStaked: 0,
        totalRewards: 0,
        unclaimedRewards: 0
    });
    // Fetch agent from backend
    useEffect(() => {
        if (!id)
            return;
        let mounted = true;
        const fetchAgent = async () => {
            try {
                const res = await fetch(`${API_URL}/api/agents/${id}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    setAgent(data);
                }
            }
            catch (error) {
                console.error('Fetch agent failed:', error);
            }
        };
        fetchAgent();
        const interval = setInterval(fetchAgent, 2000);
        return () => { mounted = false; clearInterval(interval); };
    }, [id]);
    // ✅ NEW: Fetch user stats for this agent
    useEffect(() => {
        if (!connected || !publicKey || !id)
            return;
        const wallet = publicKey.toString();
        Promise.all([
            fetch(`${API_URL}/api/stake/user/${wallet}`).then(r => r.json()),
            fetch(`${API_URL}/api/rewards/${wallet}`).then(r => r.json())
        ]).then(([stakesData, rewardsData]) => {
            const myStakes = stakesData.stakes?.filter((s) => s.agentId === id) || [];
            const myRewards = rewardsData.rewards?.filter((r) => r.agentId === id) || [];
            setUserStats({
                totalStaked: myStakes.reduce((sum, s) => sum + s.amount, 0),
                totalRewards: myRewards.reduce((sum, r) => sum + r.amount, 0),
                unclaimedRewards: myRewards.filter((r) => !r.claimed).reduce((sum, r) => sum + r.amount, 0)
            });
        }).catch(() => { });
    }, [connected, publicKey, id]);
    if (!agent)
        return _jsx("div", { className: "p-10 text-center text-gray-400", children: "Loading agent..." });
    const metadata = agent.metadata || agent;
    const name = metadata?.name || `Agent ${agent.id?.slice(0, 8)}`;
    const description = metadata?.description || 'No description provided';
    const imageUrl = metadata?.imageUrl;
    const personality = metadata?.personality || 'balanced';
    const strategy = metadata?.strategy || 'balanced';
    const token = agent.token;
    const runtime = agent.runtime || {};
    const financial = agent.financial || {};
    const score = runtime.score ?? 0;
    const lastAction = runtime.lastAction || 'idle';
    const isChampion = runtime.isChampion || false;
    const stake = financial.totalStake ?? 0;
    const holders = token?.holders || 0;
    const isCommunityPowered = holders >= 25;
    const handleShare = () => {
        const text = `🔥 My AI Agent is dominating the Arena\n\nName: ${name}\nScore: ${score}\nToken Change: ${token?.priceChange.toFixed(2)}%\n\nCan you beat it?`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };
    const handleMockBuy = async () => {
        if (!token || !id)
            return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId: id, amount: tradeAmount })
            });
            if (!res.ok)
                throw new Error('Buy failed');
            const updated = await fetch(`${API_URL}/api/agents/${id}`);
            if (updated.ok)
                setAgent(await updated.json());
        }
        catch (error) {
            console.error('Buy failed:', error);
            alert('Buy failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleMockSell = async () => {
        if (!token || !id)
            return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId: id, amount: tradeAmount })
            });
            if (!res.ok)
                throw new Error('Sell failed');
            const updated = await fetch(`${API_URL}/api/agents/${id}`);
            if (updated.ok)
                setAgent(await updated.json());
        }
        catch (error) {
            console.error('Sell failed:', error);
            alert('Sell failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleBoost = async () => {
        if (!id)
            return;
        try {
            await fetch(`${API_URL}/api/agents/${id}/boost`, { method: 'POST' });
            const updated = await fetch(`${API_URL}/api/agents/${id}`);
            if (updated.ok)
                setAgent(await updated.json());
        }
        catch (error) {
            console.error('Boost failed:', error);
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Link, { to: "/arena", className: "text-cyan-400 hover:underline", children: "\u2190 Back" }), _jsxs("div", { className: "flex gap-2", children: [!token && _jsx("button", { onClick: () => navigate(`/launch/${id}`), className: "px-4 py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500", children: "Launch Token" }), token && _jsx("button", { onClick: handleShare, className: "px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition", children: "\uD83D\uDC26 Share" })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-24 h-24 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden", children: imageUrl ? (_jsx("img", { src: imageUrl, alt: name, className: "w-full h-full object-cover", onError: (e) => { e.target.style.display = 'none'; } })) : name.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h1", { className: "text-4xl font-bold", children: name }), isCommunityPowered && _jsx("span", { className: "px-2 py-1 bg-gradient-to-r from-pink-500 to-orange-400 text-black text-xs font-bold rounded-full shadow-lg animate-pulse", children: "\uD83D\uDD25 Community Powered" })] }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx("span", { className: "px-2 py-1 bg-gray-800 rounded text-xs capitalize", children: personality }), _jsx("span", { className: "px-2 py-1 bg-gray-800 rounded text-xs capitalize", children: strategy }), token && _jsxs("span", { className: "px-2 py-1 bg-gray-800 rounded text-xs font-mono", children: ["\uD83D\uDC65 ", token.holders || 0, " Holders"] }), isChampion && _jsx("span", { className: "px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold", children: "\uD83C\uDFC6 CHAMPION" })] }), _jsx("p", { className: "text-gray-400 mt-2 max-w-xl", children: description })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-800", children: [_jsx("h3", { className: "text-lg font-bold mb-4 border-b border-gray-800 pb-2", children: "Token Info" }), token ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-400", children: "Price" }), _jsxs("span", { className: "text-xl font-mono text-cyan-400", children: ["$", token.price.toFixed(8)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Market Cap" }), _jsxs("span", { className: "font-mono text-purple-400", children: ["$", token.marketCap.toLocaleString(undefined, { maximumFractionDigits: 2 })] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Circulating" }), _jsx("span", { className: "font-mono text-gray-300", children: token.circulatingSupply.toLocaleString() })] }), _jsx("div", { className: "pt-4 border-t border-gray-800 space-y-3", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", value: tradeAmount, onChange: e => setTradeAmount(Number(e.target.value)), className: "flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm", disabled: loading }), _jsx("button", { onClick: handleMockBuy, disabled: loading, className: "bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1 rounded text-sm hover:bg-green-500/30 disabled:opacity-50", children: loading ? '...' : 'Buy' }), _jsx("button", { onClick: handleMockSell, disabled: loading, className: "bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1 rounded text-sm hover:bg-red-500/30 disabled:opacity-50", children: loading ? '...' : 'Sell' })] }) }), _jsxs("div", { className: "pt-4 border-t border-gray-800", children: [_jsx("h4", { className: "text-sm font-bold text-gray-400 mb-3", children: "\uD83D\uDC8E Stake on this Agent" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "number", placeholder: "Amount", className: "flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" }), _jsx("button", { onClick: () => { }, className: "px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-sm hover:bg-purple-500/30 transition", children: "Stake" })] }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: "Total Staked:" }), _jsx("span", { className: "text-gray-300 font-mono", children: agent.financial?.totalStake?.toLocaleString() ?? 0 })] }), agent.financial?.totalStake > 0 && (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-gray-500", children: "Power from Staking" }), _jsxs("span", { className: "text-orange-400 font-mono", children: ["\uD83D\uDD25 +", Math.min(25, Math.log10(agent.financial.totalStake + 1) * 10).toFixed(1), "%"] })] }))] })] }), connected && publicKey && (userStats.totalStaked > 0 || userStats.totalRewards > 0) && (_jsxs("div", { className: "pt-4 border-t border-gray-800", children: [_jsx("h4", { className: "text-sm font-bold text-gray-400 mb-3", children: "\uD83D\uDC64 Your Position" }), _jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [_jsxs("div", { className: "bg-gray-800/50 p-2 rounded", children: [_jsx("span", { className: "text-gray-500 block text-xs", children: "Your Stake" }), _jsx("span", { className: "font-mono text-cyan-400", children: userStats.totalStaked.toFixed(2) })] }), _jsxs("div", { className: "bg-gray-800/50 p-2 rounded", children: [_jsx("span", { className: "text-gray-500 block text-xs", children: "Your Rewards" }), _jsx("span", { className: "font-mono text-green-400", children: userStats.totalRewards.toFixed(2) })] })] }), userStats.unclaimedRewards > 0 && (_jsxs("p", { className: "text-xs text-green-400 mt-2 flex items-center gap-1", children: ["\uD83C\uDF81 ", userStats.unclaimedRewards.toFixed(2), " unclaimed"] }))] })), runtime.history && runtime.history.length > 0 && (_jsxs("div", { className: "pt-4 border-t border-gray-800", children: [_jsx("h4", { className: "text-sm font-bold text-gray-400 mb-2", children: "Battle History" }), _jsx("div", { className: "space-y-1.5 max-h-32 overflow-y-auto pr-1", children: runtime.history.map((battle, i) => (_jsxs("div", { className: "flex justify-between text-xs bg-gray-800/50 p-2 rounded", children: [_jsx("span", { className: battle.result === 'win' ? 'text-green-400' : 'text-red-400', children: battle.result.toUpperCase() }), _jsxs("span", { className: "text-gray-500", children: [battle.scoreChange >= 0 ? '+' : '', battle.scoreChange, " pts"] })] }, i))) })] }))] })) : (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("p", { children: "No token launched yet." }), _jsx("button", { onClick: () => navigate(`/launch/${id}`), className: "mt-4 text-cyan-400 hover:underline", children: "Launch now \u2192" })] }))] }), _jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-800", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 border-b border-gray-800 pb-2", children: [_jsx("h3", { className: "text-lg font-bold", children: "Agent Stats" }), _jsx("button", { onClick: handleBoost, className: "text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition", children: "\u26A1 Boost +10" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Score" }), _jsx("span", { className: "font-mono font-bold", children: score.toFixed(0) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Last Action" }), _jsx("span", { className: `capitalize font-bold ${lastAction === 'win' ? 'text-green-400' : lastAction === 'lose' ? 'text-red-400' : 'text-yellow-400'}`, children: lastAction })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-400", children: "Staked" }), _jsx("span", { className: "font-mono text-purple-400", children: stake.toFixed(0) })] }), _jsxs("div", { className: "pt-4 border-t border-gray-800", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Agent Wallet" }), _jsx("code", { className: "block text-xs bg-gray-800 p-2 rounded break-all", children: shortenWallet(agent.agentWallet) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Owner Wallet" }), _jsx("code", { className: "block text-xs bg-gray-800 p-2 rounded break-all", children: shortenWallet(agent.ownerWallet) })] })] })] })] })] }));
}
//# sourceMappingURL=AgentDetailPage.js.map