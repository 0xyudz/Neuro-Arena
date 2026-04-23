import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { StakeModalProps } from '../types';
export function StakeModal({ open, agentName, price, userBalance, onClose, onStake }) {
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    if (!open)
        return null;
    const handleSubmit = async () => {
        const stakeAmount = parseFloat(amount);
        if (!stakeAmount || stakeAmount <= 0)
            return;
        if (stakeAmount > userBalance) {
            alert('Insufficient ARENA balance');
            return;
        }
        setSubmitting(true);
        try {
            await onStake(stakeAmount);
            setAmount('');
            onClose();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/80 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-gray-900 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4", children: [_jsxs("h3", { className: "text-xl font-bold mb-4", children: ["Stake to ", agentName] }), _jsxs("div", { className: "mb-4 p-4 rounded-lg bg-gray-800", children: [_jsx("p", { className: "text-sm text-gray-400 mb-1", children: "Current Price" }), _jsxs("p", { className: "text-2xl font-bold text-cyan-400", children: [price.toFixed(6), " ARENA"] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Amount (ARENA)" }), _jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), className: "w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none", placeholder: "0.00", max: userBalance }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Balance: ", userBalance.toFixed(2), " ARENA"] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleSubmit, disabled: submitting, className: "flex-1 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-400/90 disabled:opacity-50", children: submitting ? 'Staking...' : 'Confirm Stake' }), _jsx("button", { onClick: onClose, className: "flex-1 py-3 border border-gray-600 rounded-lg hover:bg-gray-800", children: "Cancel" })] })] }) }));
}
//# sourceMappingURL=StakeModal.js.map