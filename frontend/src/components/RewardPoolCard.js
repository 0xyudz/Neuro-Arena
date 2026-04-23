import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RewardPool } from '../types';
export function RewardPoolCard({ pool }) {
    return (_jsx("div", { className: "p-6 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Reward Pool" }), _jsxs("p", { className: "text-2xl font-bold text-yellow-400", children: [pool.poolSize, " $ARENA"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-gray-400", children: "Total Staked" }), _jsxs("p", { className: "text-2xl font-bold text-cyan-400", children: [pool.totalStaked.toFixed(2), " $ARENA"] })] })] }) }));
}
//# sourceMappingURL=RewardPoolCard.js.map