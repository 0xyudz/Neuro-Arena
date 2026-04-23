"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBattleTick = runBattleTick;
const express_1 = require("express");
const database_1 = require("../config/database");
const rewardService_1 = require("../services/rewardService");
const agentBrain_1 = require("../engine/agentBrain");
const router = (0, express_1.Router)();
// ✅ Fisher-Yates shuffle for true randomness
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
// ✅ Enhanced power calculation with staking & confidence
function calculateEffectivePower(agent) {
    const scoreComponent = Math.log((agent.score || 0) + 1) * 10;
    const holderComponent = Math.log((agent.holders || 0) + 1) * 5;
    const stakeComponent = Math.log10((agent.financial?.totalStake || 0) + 1) * 12;
    const confidenceBoost = (agent.confidence ?? 0.5) * 20;
    return scoreComponent * 0.4 + holderComponent * 0.25 + stakeComponent * 0.25 + confidenceBoost * 0.1;
}
// ✅ AI Battle Log Generator with thinking trace
function generateAILog(agentA, agentB, decisionA, decisionB, winner) {
    const personalityA = (0, agentBrain_1.getAgentPersonality)(agentA);
    const personalityB = (0, agentBrain_1.getAgentPersonality)(agentB);
    const actionVerbA = decisionA.action === 'attack' ? 'ATTACK' : 'DEFEND';
    const actionVerbB = decisionB.action === 'attack' ? 'ATTACK' : 'DEFEND';
    const result = winner ? (winner.id === agentA.id ? 'WIN' : 'LOSS') : 'DRAW';
    const reason = `${agentA.name} (${personalityA}) chose ${actionVerbA} (${decisionA.reason}) vs ${agentB.name} (${personalityB}) ${actionVerbB} (${decisionB.reason}) → ${result}`;
    const thinkingTrace = {
        agentA: { action: decisionA.action, reason: decisionA.reason, thinking: decisionA.thinking },
        agentB: { action: decisionB.action, reason: decisionB.reason, thinking: decisionB.thinking }
    };
    return { reason, thinkingTrace };
}
async function runBattleTick() {
    try {
        const allAgents = await database_1.prisma.agent.findMany({ where: { score: { gt: 0 } } });
        if (allAgents.length < 2)
            return;
        const shuffled = shuffle(allAgents);
        const [agentA, agentB] = shuffled.slice(0, 2);
        // === AI Decisions ===
        const decisionA = (0, agentBrain_1.decideAction)(agentA, agentB);
        const decisionB = (0, agentBrain_1.decideAction)(agentB, agentA);
        // ... calculate power and winChance ...
        const powerA = calculateEffectivePower(agentA);
        const powerB = calculateEffectivePower(agentB);
        let winChance = 0.5;
        winChance += (powerA - powerB) * 0.0008;
        winChance += ((agentA.confidence ?? 0.5) - (agentB.confidence ?? 0.5)) * 0.25;
        if (decisionA.action === 'attack' && decisionB.action === 'defend')
            winChance += 0.12;
        if (decisionA.action === 'defend' && decisionB.action === 'attack')
            winChance -= 0.12;
        winChance = Math.max(0.2, Math.min(0.8, winChance));
        const winner = Math.random() < winChance ? agentA : agentB;
        const loser = winner.id === agentA.id ? agentB : agentA;
        // Generate Log (Safe fallback if decision is undefined)
        const personalityA = (0, agentBrain_1.getAgentPersonality)(agentA);
        const personalityB = (0, agentBrain_1.getAgentPersonality)(agentB);
        const actionA = decisionA?.action || 'defend';
        const actionB = decisionB?.action || 'defend';
        const reasonA = decisionA?.reason || 'tactical assessment';
        const reasonB = decisionB?.reason || 'tactical assessment';
        const result = winner.id === agentA.id ? 'WIN' : 'LOSS';
        const reason = `${agentA.name} (${personalityA}) chose ${actionA.toUpperCase()} (${reasonA}) vs ${agentB.name} (${personalityB}) ${actionB.toUpperCase()} (${reasonB}) → ${result}`;
        // ✅ SAFE TRACE: Ensure values exist before stringify
        const thinkingTrace = {
            agentA: {
                action: actionA,
                reason: reasonA,
                scoreFactor: decisionA?.thinking?.scoreFactor ?? 0
            },
            agentB: {
                action: actionB,
                reason: reasonB,
                scoreFactor: decisionB?.thinking?.scoreFactor ?? 0
            }
        };
        // === Update Winner ===
        const winPriceBoost = 0.005 + Math.random() * 0.025;
        const championBonus = (winner.score + 20 >= 500 && !winner.isChampion) ? 0.05 : 0;
        const newWinnerPrice = Math.max(0.00000001, winner.price * (1 + winPriceBoost + championBonus));
        const winnerUpdates = (0, agentBrain_1.updateAgentAfterBattle)(winner, 'win');
        await database_1.prisma.agent.update({
            where: { id: winner.id },
            data: {
                score: { increment: 20 },
                lastAction: 'win',
                isChampion: { set: winner.score + 20 >= 500 || winner.isChampion },
                price: newWinnerPrice,
                marketCap: newWinnerPrice * 1000000000,
                priceChange: (winPriceBoost + championBonus) * 100,
                ...winnerUpdates
            }
        });
        // ✅ FIX: JSON.stringify the thinkingTrace
        await database_1.prisma.battleLog.create({
            data: {
                agentId: winner.id,
                opponentId: loser.id,
                result: 'win',
                scoreChange: 20,
                priceChange: (winPriceBoost + championBonus) * 100,
                reason: reason,
                thinkingTrace: JSON.stringify(thinkingTrace) // ✅ Converted to String
            }
        });
        // === Update Loser ===
        const losePriceDrop = 0.005 + Math.random() * 0.015;
        const newLoserPrice = Math.max(0.00000001, loser.price * (1 - losePriceDrop));
        const loserUpdates = (0, agentBrain_1.updateAgentAfterBattle)(loser, 'lose');
        await database_1.prisma.agent.update({
            where: { id: loser.id },
            data: {
                score: { decrement: 10 },
                lastAction: 'lose',
                price: newLoserPrice,
                marketCap: newLoserPrice * 1000000000,
                priceChange: -losePriceDrop * 100,
                ...loserUpdates
            }
        });
        await database_1.prisma.battleLog.create({
            data: {
                agentId: loser.id,
                opponentId: winner.id,
                result: 'lose',
                scoreChange: -10,
                priceChange: -losePriceDrop * 100,
                reason: reason,
                thinkingTrace: JSON.stringify(thinkingTrace) // ✅ Converted to String
            }
        });
        console.log(`⚔️ ${reason}`);
        // === Reward distribution ===
        try {
            await rewardService_1.rewardService.distributeBattleReward(winner.id);
        }
        catch (err) {
            console.error('Reward distribution failed:', err);
        }
    }
    catch (error) {
        console.error('Battle tick error:', error);
    }
}
// POST /api/battle/tick - Manual trigger (optional)
router.post('/tick', async (req, res) => {
    await runBattleTick();
    res.json({ success: true });
});
// GET /api/battle/logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await database_1.prisma.battleLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 10,
            select: {
                id: true,
                agentId: true,
                result: true,
                scoreChange: true,
                priceChange: true,
                reason: true,
                thinkingTrace: true,
                timestamp: true,
                agent: { select: { name: true } }
            }
        });
        res.json(logs.map(log => ({
            id: log.id,
            agentId: log.agentId,
            agentName: log.agent.name,
            action: 'attack',
            scoreDelta: log.scoreChange,
            priceChange: log.priceChange,
            timestamp: log.timestamp.getTime(),
            reason: log.reason,
            // ✅ Parse JSON string back to object
            thinkingTrace: log.thinkingTrace ? JSON.parse(log.thinkingTrace) : null
        })));
    }
    catch (error) {
        console.error('Fetch logs error:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});
exports.default = router;
//# sourceMappingURL=battle.js.map