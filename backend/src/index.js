"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const battle_1 = require("./routes/battle");
const agents_1 = __importDefault(require("./routes/agents"));
const battle_2 = __importDefault(require("./routes/battle"));
const trade_1 = __importDefault(require("./routes/trade"));
const stake_1 = __importDefault(require("./routes/stake"));
const reward_1 = __importDefault(require("./routes/reward"));
const leaderboard_1 = __importDefault(require("./routes/leaderboard"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/agents', agents_1.default);
app.use('/api/battle', battle_2.default);
app.use('/api', trade_1.default);
app.use('/api/stake', stake_1.default);
app.use('/api/rewards', reward_1.default);
app.use('/api/leaderboard', leaderboard_1.default);
// ✅ SERVER-SIDE BATTLE LOOP - Runs independently of frontend
let battleInterval = null;
function startBattleLoop() {
    if (battleInterval)
        clearInterval(battleInterval);
    battleInterval = setInterval(async () => {
        await (0, battle_1.runBattleTick)();
    }, 4000); // Every 4 seconds
    console.log('⚔️ Battle loop started (server-side)');
}
function stopBattleLoop() {
    if (battleInterval) {
        clearInterval(battleInterval);
        battleInterval = null;
        console.log('🛑 Battle loop stopped');
    }
}
// Start loop on server startup
startBattleLoop();
// Optional: Handle graceful shutdown
process.on('SIGINT', () => {
    stopBattleLoop();
    process.exit(0);
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map