import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Personality, Strategy, AgentAttributes } from '../types/agent';
const API_URL = 'http://localhost:3001';
export function CreateAgentPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        imageUrl: '',
        personality: 'balanced',
        strategy: 'balanced',
        tokenSymbol: '',
        risk: 0.5,
        attributes: {
            risk: 0.5,
            consistency: 0.5,
            speed: 0.5
        },
    });
    const handleNext = () => {
        if (step === 1 && !form.name) {
            alert('Name is required');
            return;
        }
        if (step === 3) {
            handleSubmit();
            return;
        }
        setStep(s => s + 1);
    };
    const handleSubmit = async () => {
        setLoading(true);
        try {
            // ✅ Generate random wallets
            const ownerWallet = '0x' + Math.random().toString(16).slice(2).padEnd(40, '0');
            const agentWallet = 'AGENT_' + Math.random().toString(36).slice(2, 10).toUpperCase();
            const tokenMint = 'MINT_' + Math.random().toString(36).slice(2, 10).toUpperCase();
            const tokenSymbol = form.tokenSymbol || form.name.slice(0, 4).toUpperCase();
            const payload = {
                ownerWallet,
                agentWallet,
                tokenSymbol,
                tokenMint,
                name: form.name,
                description: form.description,
                personality: form.personality,
                strategy: form.strategy, // ✅ Already exists
                imageUrl: form.imageUrl || '',
                risk: form.risk, // ✅ NEW: Include risk
                confidence: 0.5, // ✅ NEW: Initialize AI fields
                wins: 0,
                losses: 0,
                score: 100,
                lastAction: 'idle',
                isChampion: false,
                price: 0.0001,
                marketCap: 100000,
                holders: 0,
                volume24h: 0,
                trades: 0,
            };
            console.log('📤 Sending to backend:', payload);
            // ✅ POST ke backend API
            const res = await fetch(`${API_URL}/api/agents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create agent');
            }
            const createdAgent = await res.json();
            console.log('✅ Agent created:', createdAgent);
            // ✅ Redirect ke halaman agent yang baru dibuat
            navigate(`/agent/${createdAgent.id}`);
        }
        catch (error) {
            console.error('❌ Create failed:', error);
            alert('Failed to create agent: ' + error.message);
        }
        finally {
            setLoading(false);
        }
    };
    const Slider = ({ label, value, onChange }) => (_jsxs("div", { className: "mb-4", children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: [label, ": ", value.toFixed(2)] }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: value, onChange: (e) => onChange(Number(e.target.value)), className: "w-full accent-cyan-500" })] }));
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Deploy AI Agent" }), _jsxs("span", { className: "text-gray-400", children: ["Step ", step, "/3"] })] }), _jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6", children: [step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Agent Name *" }), _jsx("input", { required: true, value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition", placeholder: "CyberWolf-1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition h-24", placeholder: "Describe your agent's capabilities..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Image URL (optional)" }), _jsx("input", { value: form.imageUrl, onChange: (e) => setForm({ ...form, imageUrl: e.target.value }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition", placeholder: "https://example.com/image.png" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Token Symbol" }), _jsx("input", { value: form.tokenSymbol, onChange: (e) => setForm({ ...form, tokenSymbol: e.target.value.toUpperCase().slice(0, 6) }), maxLength: 6, className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition", placeholder: "WOLF" })] })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Strategy" }), _jsxs("select", { value: form.strategy, onChange: (e) => setForm({ ...form, strategy: e.target.value }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition", children: [_jsx("option", { value: "aggressive", children: "Aggressive - High risk, high reward" }), _jsx("option", { value: "balanced", children: "Balanced - Moderate approach" }), _jsx("option", { value: "defensive", children: "Defensive - Safe and steady" })] })] }), _jsxs("div", { className: "pt-2", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Personality Preset" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => setForm({ ...form, strategy: 'aggressive', risk: 0.9 }), className: "flex-1 px-3 py-2 text-xs rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition", children: "\uD83C\uDFAF Sniper" }), _jsx("button", { type: "button", onClick: () => setForm({ ...form, strategy: 'defensive', risk: 0.2 }), className: "flex-1 px-3 py-2 text-xs rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition", children: "\uD83D\uDEE1\uFE0F Guardian" }), _jsx("button", { type: "button", onClick: () => setForm({ ...form, strategy: 'balanced', risk: 0.5 }), className: "flex-1 px-3 py-2 text-xs rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition", children: "\uD83E\uDDE0 Strategist" })] })] }), _jsxs("div", { className: "pt-4", children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Risk Tolerance: ", (form.risk * 100).toFixed(0), "%"] }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.1", value: form.risk, onChange: (e) => setForm({ ...form, risk: Number(e.target.value) }), className: "w-full accent-cyan-500" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [_jsx("span", { children: "Cautious" }), _jsx("span", { children: "Balanced" }), _jsx("span", { children: "Aggressive" })] })] }), _jsx(Slider, { label: "Risk", value: form.attributes.risk, onChange: (val) => setForm({ ...form, attributes: { ...form.attributes, risk: val } }) }), _jsx(Slider, { label: "Consistency", value: form.attributes.consistency, onChange: (val) => setForm({ ...form, attributes: { ...form.attributes, consistency: val } }) }), _jsx(Slider, { label: "Speed", value: form.attributes.speed, onChange: (val) => setForm({ ...form, attributes: { ...form.attributes, speed: val } }) })] })), step === 3 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-gray-800 p-4 rounded-lg space-y-2", children: [_jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Name:" }), ' ', _jsx("span", { className: "font-bold", children: form.name })] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Description:" }), ' ', form.description || '-'] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Strategy:" }), ' ', _jsx("span", { className: "text-cyan-400 capitalize", children: form.strategy })] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Personality:" }), ' ', _jsx("span", { className: "text-purple-400 capitalize", children: form.personality })] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Token Symbol:" }), ' ', form.tokenSymbol || form.name.slice(0, 4).toUpperCase()] }), _jsxs("div", { className: "pt-2 border-t border-gray-700", children: [_jsx("p", { className: "text-sm text-gray-400 mb-2", children: "Attributes:" }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-sm", children: [_jsxs("div", { className: "bg-gray-700 p-2 rounded text-center", children: [_jsx("span", { className: "text-gray-400 block", children: "Risk" }), _jsx("span", { className: "font-mono", children: form.attributes.risk.toFixed(2) })] }), _jsxs("div", { className: "bg-gray-700 p-2 rounded text-center", children: [_jsx("span", { className: "text-gray-400 block", children: "Consistency" }), _jsx("span", { className: "font-mono", children: form.attributes.consistency.toFixed(2) })] }), _jsxs("div", { className: "bg-gray-700 p-2 rounded text-center", children: [_jsx("span", { className: "text-gray-400 block", children: "Speed" }), _jsx("span", { className: "font-mono", children: form.attributes.speed.toFixed(2) })] })] })] })] }), _jsx("div", { className: "bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg", children: _jsx("p", { className: "text-yellow-400 text-sm", children: "\u26A0\uFE0F This will deploy your agent to the Arena and mint its token." }) })] })), _jsxs("div", { className: "flex gap-4 pt-4", children: [step > 1 && (_jsx("button", { onClick: () => setStep(s => s - 1), className: "flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium", children: "Back" })), _jsx("button", { onClick: handleNext, disabled: loading, className: "flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Deploying...' : step === 3 ? 'Confirm & Deploy' : 'Next' })] })] })] }));
}
//# sourceMappingURL=CreateAgentPage.js.map