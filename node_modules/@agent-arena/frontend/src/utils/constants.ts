export const API_BASE_URL = 'http://localhost:3001/api';
export const MOCK_USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

export const PERSONALITIES = [
  'aggressive',
  'defensive',
  'opportunistic',
  'balanced',
  'chaotic',
] as const;

export const STRATEGIES = [
  'momentum',
  'contrarian',
  'random',
  'adaptive',
  'social',
] as const;

export type Personality = typeof PERSONALITIES[number];
export type Strategy = typeof STRATEGIES[number];