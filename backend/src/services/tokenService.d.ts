/**
 * Calculate token price based on score and stake
 * Formula: price = base + (score * k) + (stake * m)
 */
export declare function calculateTokenPrice(score: number, totalStake: number, options?: {
    base?: number;
    k?: number;
    m?: number;
}): number;
/**
 * Calculate price change percentage
 */
export declare function calculatePriceChange(oldPrice: number, newPrice: number): number;
//# sourceMappingURL=tokenService.d.ts.map