// shared/src/constants.ts
// ✅ FIX: Added 'ActionResult' to imports
export const SIMULATION_INTERVAL_MS = 5000;
export const MAX_HISTORY_ENTRIES = 50;
export const DEFAULT_INITIAL_BUY_SOL = 0.01;
export const LEADERBOARD_UPDATE_INTERVAL = 3;
export const PERSONALITIES = [
    'aggressive',
    'defensive',
    'opportunistic',
    'balanced',
    'chaotic'
];
export const STRATEGIES = [
    'momentum',
    'contrarian',
    'random',
    'adaptive',
    'social'
];
export const ACTION_WEIGHTS = {
    aggressive: { attack: 0.5, defend: 0.1, boost: 0.2, retreat: 0.05, observe: 0.1, ally: 0.05 },
    defensive: { attack: 0.1, defend: 0.5, boost: 0.15, retreat: 0.15, observe: 0.05, ally: 0.05 },
    opportunistic: { attack: 0.25, defend: 0.15, boost: 0.2, retreat: 0.1, observe: 0.2, ally: 0.1 },
    balanced: { attack: 0.2, defend: 0.2, boost: 0.2, retreat: 0.15, observe: 0.15, ally: 0.1 },
    chaotic: { attack: 0.3, defend: 0.1, boost: 0.1, retreat: 0.1, observe: 0.1, ally: 0.3 }
};
export const ACTION_SCORE_MODIFIERS = {
    success: { attack: 5, defend: 2, boost: 4, retreat: 1, observe: 0.5, ally: 3 },
    failure: { attack: -3, defend: -1, boost: -2, retreat: 0, observe: 0, ally: -2 },
    partial: { attack: 1, defend: 1, boost: 1, retreat: 0.5, observe: 0.25, ally: 1 },
    neutral: { attack: 0, defend: 0.5, boost: 0, retreat: 0.5, observe: 0.5, ally: 0 }
};
export const BAGS_BASE_URL = 'https://public-api-v2.bags.fm/api/v1/';
export const BAGS_NETWORK = 'mainnet-beta';
export const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
export const DEFAULT_TOKEN_DECIMALS = 6;
export const DEFAULT_TOKEN_SUPPLY = 1_000_000_000;
export const UI = {
    ANIMATION_DURATION: 200,
    TOAST_DURATION: 3000,
    AUTO_SCROLL_THRESHOLD: 100,
    POLL_INTERVAL: 10000,
};
export const ERRORS = {
    AGENT_NOT_FOUND: 'AGENT_NOT_FOUND',
    TOKEN_LAUNCH_FAILED: 'TOKEN_LAUNCH_FAILED',
    INVALID_PERSONALITY: 'INVALID_PERSONALITY',
    INVALID_STRATEGY: 'INVALID_STRATEGY',
    WEBSOCKET_FAILED: 'WEBSOCKET_FAILED',
    API_TIMEOUT: 'API_TIMEOUT',
};
