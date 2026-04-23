-- CreateTable
CREATE TABLE "Agent" (
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "price" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BattleLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "opponentId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "scoreChange" INTEGER NOT NULL,
    "priceChange" REAL NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BattleLog_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_agentWallet_key" ON "Agent"("agentWallet");
