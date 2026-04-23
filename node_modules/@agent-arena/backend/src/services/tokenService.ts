// backend/src/services/tokenService.ts

/**
 * Calculate token price based on score and stake
 * Formula: price = base + (score * k) + (stake * m)
 */
export function calculateTokenPrice(
  score: number,
  totalStake: number,
  options?: { base?: number; k?: number; m?: number }
): number {
  const { base = 0.01, k = 0.0001, m = 0.00001 } = options || {};
  
  const price = base + (score * k) + (totalStake * m);
  
  // Clamp to reasonable range
  return Math.max(0.001, Math.min(100, price));
}

/**
 * Calculate price change percentage
 */
export function calculatePriceChange(oldPrice: number, newPrice: number): number {
  if (oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
}