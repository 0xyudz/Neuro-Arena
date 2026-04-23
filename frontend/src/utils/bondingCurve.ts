// Base price and slope for the bonding curve
const BASE_PRICE = 0.0001;
const K = 0.00000005; // Price increases by this amount per token in circulation

export function calculatePrice(circulatingSupply: number): number {
  return BASE_PRICE + (circulatingSupply * K);
}

export function calculateMarketCap(price: number, totalSupply: number): number {
  return price * totalSupply;
}