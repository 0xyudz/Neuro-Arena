import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentRegistry } from '../lib/agents/registry';
import { calculatePrice, calculateMarketCap } from '../utils/bondingCurve';
export function LaunchTokenPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        description: '',
        imageUrl: '',
        initialSupply: 1000000000,
    });
    const agent = id ? AgentRegistry.getAgentById(id) : null;
    if (!agent)
        return _jsx("div", { className: "p-10 text-center text-red-400", children: "Agent not found." });
    const handleLaunch = () => {
        if (!id)
            return;
        const mint = 'MINT_' + Math.random().toString(36).substring(2, 15).toUpperCase();
        const currentSupply = 0;
        const price = calculatePrice(currentSupply);
        const marketCap = calculateMarketCap(price, formData.initialSupply);
        const tokenData = {
            mint,
            name: formData.name,
            symbol: formData.symbol,
            description: formData.description,
            imageUrl: formData.imageUrl,
            supply: formData.initialSupply,
            circulatingSupply: currentSupply,
            price,
            marketCap,
            createdAt: Date.now(),
            transactions: [],
        };
        AgentRegistry.updateAgent(id, { token: tokenData });
        navigate(`/agent/${id}`);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("h1", { className: "text-3xl font-bold", children: ["Launch Token for ", agent.metadata?.name || agent.name] }), _jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6", children: [step === 1 && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Token Name *" }), _jsx("input", { required: true, value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700", placeholder: "e.g. WolfCoin" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Symbol *" }), _jsx("input", { required: true, value: formData.symbol, onChange: e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700", placeholder: "e.g. WOLF", maxLength: 6 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Total Supply" }), _jsx("input", { type: "number", value: formData.initialSupply, onChange: e => setFormData({ ...formData, initialSupply: Number(e.target.value) }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: e => setFormData({ ...formData, description: e.target.value }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 h-24" })] })] })), step === 2 && (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "p-4 bg-gray-800 rounded-lg space-y-2", children: [_jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Name:" }), " ", formData.name] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Symbol:" }), " ", formData.symbol] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400", children: "Supply:" }), " ", formData.initialSupply.toLocaleString()] })] }) })), _jsxs("div", { className: "flex gap-4 pt-4", children: [step > 1 && _jsx("button", { onClick: () => setStep(s => s - 1), className: "flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700", children: "Back" }), step < 2 ? (_jsx("button", { onClick: () => setStep(2), className: "flex-1 py-3 rounded-lg bg-cyan-500 text-black font-bold", children: "Review" })) : (_jsx("button", { onClick: handleLaunch, className: "flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold hover:opacity-90", children: "\uD83D\uDE80 Launch Token" }))] })] })] }));
}
//# sourceMappingURL=LaunchTokenPage.js.map