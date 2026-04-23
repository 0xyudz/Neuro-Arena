// backend/src/config/database.ts
// Prisma client singleton

import { PrismaClient } from '@prisma/client';
import { config } from './env';

// Prevent multiple Prisma instances in dev (hot reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: config.DATABASE_URL,
    },
  },
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (config.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper: Initialize database (create tables if needed)
export async function initializeDatabase() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // In dev, we could run migrations here if needed
    // await prisma.$executeRaw`SELECT 1`; // Simple health check
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Helper: Close database connection
export async function shutdownDatabase() {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
}