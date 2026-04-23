"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stakeService_1 = require("../services/stakeService");
const router = (0, express_1.Router)();
// POST /api/stake
router.post('/', async (req, res) => {
    try {
        const { userWallet, agentId, amount } = req.body;
        if (!userWallet || !agentId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await stakeService_1.stakeService.stake(userWallet, agentId, amount);
        res.json({
            success: true,
            stake: result.stake,
            totalStake: result.totalStake
        });
    }
    catch (error) {
        console.error('Stake error:', error);
        res.status(500).json({ error: error.message || 'Stake failed' });
    }
});
// GET /api/stake/agent/:id
router.get('/agent/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const totalStake = await stakeService_1.stakeService.getAgentTotalStake(id);
        const stakes = await stakeService_1.stakeService.getAgentStakes(id);
        res.json({ totalStake, stakes });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch stakes' });
    }
});
// GET /api/stake/user/:wallet
router.get('/user/:wallet', async (req, res) => {
    try {
        const { wallet } = req.params;
        const stakes = await stakeService_1.stakeService.getUserStakes(wallet);
        res.json({ stakes });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch user stakes' });
    }
});
exports.default = router;
//# sourceMappingURL=stake.js.map