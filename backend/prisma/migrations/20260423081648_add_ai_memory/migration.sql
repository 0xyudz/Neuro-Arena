-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerWallet" TEXT NOT NULL,
    "agentWallet" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "tokenMint" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "personality" TEXT NOT NULL DEFAULT 'balanced',
    "strategy" TEXT NOT NULL DEFAULT 'balanced',
    "imageUrl" TEXT,
    "score" INTEGER NOT NULL DEFAULT 100,
    "lastAction" TEXT NOT NULL DEFAULT 'idle',
    "isChampion" BOOLEAN NOT NULL DEFAULT false,
    "price" REAL NOT NULL DEFAULT 0.0001,
    "marketCap" REAL NOT NULL DEFAULT 0,
    "priceChange" REAL NOT NULL DEFAULT 0,
    "holders" INTEGER NOT NULL DEFAULT 0,
    "volume24h" REAL NOT NULL DEFAULT 0,
    "trades" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "winStreak" INTEGER NOT NULL DEFAULT 0,
    "loseStreak" INTEGER NOT NULL DEFAULT 0,
    "recentTrend" TEXT NOT NULL DEFAULT 'stable',
    "confidence" REAL NOT NULL DEFAULT 0.5,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Agent" ("agentWallet", "confidence", "createdAt", "description", "holders", "id", "imageUrl", "isChampion", "lastAction", "losses", "marketCap", "name", "ownerWallet", "personality", "price", "priceChange", "score", "strategy", "tokenMint", "tokenSymbol", "trades", "updatedAt", "volume24h", "wins") SELECT "agentWallet", "confidence", "createdAt", "description", "holders", "id", "imageUrl", "isChampion", "lastAction", "losses", "marketCap", "name", "ownerWallet", "personality", "price", "priceChange", "score", "strategy", "tokenMint", "tokenSymbol", "trades", "updatedAt", "volume24h", "wins" FROM "Agent";
DROP TABLE "Agent";
ALTER TABLE "new_Agent" RENAME TO "Agent";
CREATE UNIQUE INDEX "Agent_agentWallet_key" ON "Agent"("agentWallet");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
