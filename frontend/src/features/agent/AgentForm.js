import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Reusable agent creation form
import { useState } from 'react';
import { CreateAgentInput, Personality } from '../../types';
const PERSONALITIES = [
    'aggressive', 'defensive', 'opportunistic', 'balanced', 'chaotic'
];
export function AgentForm({ onSubmit, loading }) {
    const [form, setForm] = useState({
        name: '',
        personality: 'balanced',
        strategyPrompt: '',
        tokenSymbol: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Agent Name *" }), _jsx("input", { required: true, value: form.name, onChange: e => setForm({ ...form, name: e.target.value }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none", placeholder: "e.g., CyberWolf-1" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Personality" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: PERSONALITIES.map(p => (_jsx("button", { type: "button", onClick: () => setForm({ ...form, personality: p }), className: `px-3 py-2 rounded-lg text-sm capitalize ${form.personality === p
                                ? 'bg-cyan-400 text-black'
                                : 'bg-gray-800 border border-gray-700 hover:border-cyan-400'}`, children: p }, p))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Strategy Prompt *" }), _jsx("textarea", { required: true, value: form.strategyPrompt, onChange: e => setForm({ ...form, strategyPrompt: e.target.value }), rows: 3, className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none resize-none", placeholder: "e.g., 'Attack when winning, adapt when losing'" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "This guides your agent's autonomous decisions" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Token Symbol *" }), _jsx("input", { required: true, value: form.tokenSymbol, onChange: e => setForm({ ...form, tokenSymbol: e.target.value.toUpperCase().slice(0, 6) }), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none", placeholder: "e.g., CWOLF", maxLength: 6 })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold hover:opacity-90 transition disabled:opacity-50", children: loading ? '🚀 Launching Token...' : 'Deploy Agent + Launch Token' })] }));
}
//# sourceMappingURL=AgentForm.js.map