"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rewardService_1 = require("../services/rewardService");
const router = (0, express_1.Router)();
// GET /api/rewards/:wallet
router.get('/:wallet', async (req, res) => {
    try {
        const { wallet } = req.params;
        const result = await rewardService_1.rewardService.getUserRewards(wallet);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch rewards' });
    }
});
// ✅ NEW: POST /api/rewards/claim
router.post('/claim', async (req, res) => {
    try {
        const { userWallet } = req.body;
        if (!userWallet)
            return res.status(400).json({ error: 'userWallet required' });
        const result = await rewardService_1.rewardService.claimRewards(userWallet);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Claim failed' });
    }
});
exports.default = router;
//# sourceMappingURL=reward.js.map