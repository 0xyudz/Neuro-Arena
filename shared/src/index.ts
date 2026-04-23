// ============================================================================
// SHARED PACKAGE ENTRY POINT
// Export all types and constants for frontend/backend usage
// ============================================================================

// Types
export * from './types';

// Constants
export * from './constants';

// ============================================================================
// UTILITY FUNCTIONS (optional helpers)
// ============================================================================

/**
 * Validate if a string is a valid Solana address (base58, 32-44 chars)
 */
export function isValidSolanaAddress(address: string): boolean {
  // Simple validation - base58 alphabet, length 32-44
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

/**
 * Truncate address for display: "Abc...Xyz"
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address || address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format SOL amount with proper decimals
 */
export function formatSol(amount: number, decimals = 4): string {
  return amount.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Generate a simple unique ID (for mock/demo purposes)
 * NOT cryptographically secure - use uuid in production
 */
export function generateMockId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * Debounce function for rate-limiting UI updates
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}