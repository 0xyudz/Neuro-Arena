import { PersonalityType, StrategyType, ActionType, ActionResult } from './types';
export declare const SIMULATION_INTERVAL_MS = 5000;
export declare const MAX_HISTORY_ENTRIES = 50;
export declare const DEFAULT_INITIAL_BUY_SOL = 0.01;
export declare const LEADERBOARD_UPDATE_INTERVAL = 3;
export declare const PERSONALITIES: readonly PersonalityType[];
export declare const STRATEGIES: readonly StrategyType[];
export declare const ACTION_WEIGHTS: Record<PersonalityType, Record<ActionType, number>>;
export declare const ACTION_SCORE_MODIFIERS: Record<ActionResult, Record<ActionType, number>>;
export declare const BAGS_BASE_URL = "https://public-api-v2.bags.fm/api/v1/";
export declare const BAGS_NETWORK = "mainnet-beta";
export declare const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
export declare const DEFAULT_TOKEN_DECIMALS = 6;
export declare const DEFAULT_TOKEN_SUPPLY = 1000000000;
export declare const UI: {
    ANIMATION_DURATION: number;
    TOAST_DURATION: number;
    AUTO_SCROLL_THRESHOLD: number;
    POLL_INTERVAL: number;
};
export declare const ERRORS: {
    readonly AGENT_NOT_FOUND: "AGENT_NOT_FOUND";
    readonly TOKEN_LAUNCH_FAILED: "TOKEN_LAUNCH_FAILED";
    readonly INVALID_PERSONALITY: "INVALID_PERSONALITY";
    readonly INVALID_STRATEGY: "INVALID_STRATEGY";
    readonly WEBSOCKET_FAILED: "WEBSOCKET_FAILED";
    readonly API_TIMEOUT: "API_TIMEOUT";
};
export type ErrorCode = typeof ERRORS[keyof typeof ERRORS];
