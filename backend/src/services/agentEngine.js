"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentEngine = void 0;
const database_1 = require("../config/database");
const broadcast_1 = require("../websocket/broadcast");
class AgentEngine {
    round = 0;
    running = false;
    interval = null;
    // ✅ Method ini HARUS ada
    start() {
        if (this.running)
            return;
        this.running = true;
        console.log('🤖 Agent engine STARTED - running every 3 seconds');
        this.interval = setInterval(async () => {
            try {
                await this.runRound();
            }
            catch (err) {
                console.error('Engine round error:', err);
            }
        }, 3000);
    }
    stop() {
        this.running = false;
        if (this.interval) {
            clearInterval(this.interval);
            console.log('🛑 Agent engine STOPPED');
        }
    }
    async runRound() {
        this.round++;
        console.log(`🎮 Round #${this.round}`);
        const agents = await database_1.prisma.agent.findMany({
            where: { active: true }
        });
        if (agents.length < 1) {
            console.log('⏳ No active agents');
            return;
        }
        const updates = [];
        for (const agent of agents) {
            // Simple logic: attack if score > 100, else defend
            const action = agent.score > 100 ? 'attack' : 'defend';
            const delta = action === 'attack' ? 5 : 2;
            const newScore = agent.score + delta;
            const newPrice = 0.01 + (newScore * 0.0001) + (agent.totalStake * 0.00001);
            // ✅ CRITICAL: Ketik persis "data: {"
            await database_1.prisma.agent.update({
                where: { id: agent.id },
                data: {
                    score: newScore,
                    tokenPrice: newPrice,
                    priceChange: ((newPrice - agent.tokenPrice) / agent.tokenPrice) * 100,
                    lastActionAt: new Date(),
                },
            });
            updates.push({
                id: agent.id,
                score: newScore,
                lastAction: action,
                tokenPrice: newPrice,
                priceChange: ((newPrice - agent.tokenPrice) / agent.tokenPrice) * 100,
            });
        }
        // Broadcast ke frontend
        (0, broadcast_1.broadcastUpdate)({
            type: 'agent_updates',
            payload: { updates, round: this.round },
            timestamp: Date.now(),
        });
        console.log(`✅ Round ${this.round} complete - ${updates.length} agents updated`);
    }
}
// ✅ Export instance
exports.agentEngine = new AgentEngine();
//# sourceMappingURL=agentEngine.js.map