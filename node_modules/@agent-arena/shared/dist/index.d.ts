export * from './types';
export * from './constants';
/**
 * Validate if a string is a valid Solana address (base58, 32-44 chars)
 */
export declare function isValidSolanaAddress(address: string): boolean;
/**
 * Truncate address for display: "Abc...Xyz"
 */
export declare function truncateAddress(address: string, chars?: number): string;
/**
 * Format SOL amount with proper decimals
 */
export declare function formatSol(amount: number, decimals?: number): string;
/**
 * Generate a simple unique ID (for mock/demo purposes)
 * NOT cryptographically secure - use uuid in production
 */
export declare function generateMockId(prefix?: string): string;
/**
 * Safe JSON parse with fallback
 */
export declare function safeJsonParse<T>(str: string, fallback: T): T;
/**
 * Debounce function for rate-limiting UI updates
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
