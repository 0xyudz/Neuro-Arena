"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// GET /api/leaderboard
router.get('/', async (req, res) => {
    try {
        const agents = await database_1.prisma.agent.findMany({
            orderBy: [
                { score: 'desc' },
                { marketCap: 'desc' }
            ],
            take: 50,
            select: {
                id: true,
                name: true,
                tokenSymbol: true,
                score: true,
                price: true,
                marketCap: true,
                holders: true,
                isChampion: true
            }
        });
        // Calculate rank
        const leaderboard = agents.map((agent, index) => ({
            rank: index + 1,
            id: agent.id,
            name: agent.name,
            tokenSymbol: agent.tokenSymbol,
            score: agent.score,
            price: agent.price,
            marketCap: agent.marketCap,
            holders: agent.holders,
            isChampion: agent.isChampion
        }));
        res.json({ leaderboard });
    }
    catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});
exports.default = router;
//# sourceMappingURL=leaderboard.js.map