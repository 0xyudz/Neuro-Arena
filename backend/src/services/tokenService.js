"use strict";
// backend/src/services/tokenService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTokenPrice = calculateTokenPrice;
exports.calculatePriceChange = calculatePriceChange;
/**
 * Calculate token price based on score and stake
 * Formula: price = base + (score * k) + (stake * m)
 */
function calculateTokenPrice(score, totalStake, options) {
    const { base = 0.01, k = 0.0001, m = 0.00001 } = options || {};
    const price = base + (score * k) + (totalStake * m);
    // Clamp to reasonable range
    return Math.max(0.001, Math.min(100, price));
}
/**
 * Calculate price change percentage
 */
function calculatePriceChange(oldPrice, newPrice) {
    if (oldPrice === 0)
        return 0;
    return ((newPrice - oldPrice) / oldPrice) * 100;
}
//# sourceMappingURL=tokenService.js.map