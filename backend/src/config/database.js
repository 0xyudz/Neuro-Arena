"use strict";
// backend/src/config/database.ts
// Prisma client singleton
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.initializeDatabase = initializeDatabase;
exports.shutdownDatabase = shutdownDatabase;
const client_1 = require("@prisma/client");
const env_1 = require("./env");
// Prevent multiple Prisma instances in dev (hot reload)
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient({
    datasources: {
        db: {
            url: env_1.config.DATABASE_URL,
        },
    },
    log: env_1.config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
if (env_1.config.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
// Helper: Initialize database (create tables if needed)
async function initializeDatabase() {
    try {
        // Test connection
        await exports.prisma.$connect();
        console.log('✅ Database connected');
        // In dev, we could run migrations here if needed
        // await prisma.$executeRaw`SELECT 1`; // Simple health check
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}
// Helper: Close database connection
async function shutdownDatabase() {
    await exports.prisma.$disconnect();
    console.log('🔌 Database disconnected');
}
//# sourceMappingURL=database.js.map