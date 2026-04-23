import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function initializeDatabase(): Promise<boolean>;
export declare function shutdownDatabase(): Promise<void>;
//# sourceMappingURL=database.d.ts.map