import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AgentAction } from '../types/agent';
const ACTION_CONFIG = {
    attack: { emoji: '🔥', color: 'text-red-400', label: 'Attacking' },
    defend: { emoji: '🛡️', color: 'text-blue-400', label: 'Defending' },
    adapt: { emoji: '⚡', color: 'text-yellow-400', label: 'Adapting' },
};
export function AgentActionBadge({ action }) {
    const config = ACTION_CONFIG[action] || ACTION_CONFIG.adapt;
    return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-medium ${config.color}`, children: [_jsx("span", { children: config.emoji }), _jsx("span", { children: config.label })] }));
}
//# sourceMappingURL=AgentActionBadge.js.map