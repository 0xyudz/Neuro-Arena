// backend/src/config/env.ts

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),  // ✅ Default 3001
  WS_PORT: z.string().transform(Number).default('3002'), // ✅ Default 3002
  DATABASE_URL: z.string().default('file:./dev.db'),
  BAGS_API_KEY: z.string().optional(),
  SOLANA_RPC_URL: z.string().default('https://api.mainnet-beta.solana.com'),
  PRIVATE_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid env:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;

// Helper untuk log
export function logStartupInfo() {
  console.log(`🔧 Environment: ${config.NODE_ENV}`);
  console.log(`🌐 Server: http://localhost:${config.PORT || 3001}`);  // ✅ Fallback
  console.log(`🔌 WebSocket: ws://localhost:${config.WS_PORT || 3002}`); // ✅ Fallback
  console.log(`💾 Database: ${config.DATABASE_URL}`);
  console.log(`🪙 Bags Mode: ${!config.BAGS_API_KEY ? '🎭 MOCK' : '✅ LIVE'}`);
}

export const isMockMode = !config.BAGS_API_KEY;