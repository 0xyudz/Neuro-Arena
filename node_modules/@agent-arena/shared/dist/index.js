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
export function isValidSolanaAddress(address) {
    // Simple validation - base58 alphabet, length 32-44
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
}
/**
 * Truncate address for display: "Abc...Xyz"
 */
export function truncateAddress(address, chars = 4) {
    if (!address || address.length <= chars * 2)
        return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
/**
 * Format SOL amount with proper decimals
 */
export function formatSol(amount, decimals = 4) {
    return amount.toFixed(decimals).replace(/\.?0+$/, '');
}
/**
 * Generate a simple unique ID (for mock/demo purposes)
 * NOT cryptographically secure - use uuid in production
 */
export function generateMockId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse(str, fallback) {
    try {
        return JSON.parse(str);
    }
    catch {
        return fallback;
    }
}
/**
 * Debounce function for rate-limiting UI updates
 */
export function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
