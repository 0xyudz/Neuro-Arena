"use strict";
// backend/src/config/env.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMockMode = exports.config = void 0;
exports.logStartupInfo = logStartupInfo;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('3001'), // ✅ Default 3001
    WS_PORT: zod_1.z.string().transform(Number).default('3002'), // ✅ Default 3002
    DATABASE_URL: zod_1.z.string().default('file:./dev.db'),
    BAGS_API_KEY: zod_1.z.string().optional(),
    SOLANA_RPC_URL: zod_1.z.string().default('https://api.mainnet-beta.solana.com'),
    PRIVATE_KEY: zod_1.z.string().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid env:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.config = parsed.data;
// Helper untuk log
function logStartupInfo() {
    console.log(`🔧 Environment: ${exports.config.NODE_ENV}`);
    console.log(`🌐 Server: http://localhost:${exports.config.PORT || 3001}`); // ✅ Fallback
    console.log(`🔌 WebSocket: ws://localhost:${exports.config.WS_PORT || 3002}`); // ✅ Fallback
    console.log(`💾 Database: ${exports.config.DATABASE_URL}`);
    console.log(`🪙 Bags Mode: ${!exports.config.BAGS_API_KEY ? '🎭 MOCK' : '✅ LIVE'}`);
}
exports.isMockMode = !exports.config.BAGS_API_KEY;
//# sourceMappingURL=env.js.map