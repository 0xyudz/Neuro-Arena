"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideAction = decideAction;
exports.getAgentPersonality = getAgentPersonality;
exports.updateAgentAfterBattle = updateAgentAfterBattle;
const client_1 = require("@prisma/client");
/**
 * Determine agent's action based on strategy, confidence, and opponent stats
 * ✅ ENHANCED: Fairness & balance improvements
 */
function decideAction(agent, opponent) {
    let attackScore = 0;
    let defendScore = 0;
    // === 1. DIMINISHING RETURNS: Log-scale score comparison ===
    const normalizedScore = Math.log((agent.score || 0) + 1);
    const normalizedOpponent = Math.log((opponent.score || 0) + 1);
    if (normalizedScore > normalizedOpponent + 0.3) {
        attackScore += 0.25; // Smaller advantage from raw score
    }
    else if (normalizedScore < normalizedOpponent - 0.3) {
        defendScore += 0.25;
    }
    // === 2. UNDERDOG BONUS: Comeback mechanic ===
    if ((agent.score || 0) < (opponent.score || 0)) {
        attackScore += 0.15; // Underdogs get slight aggression boost
    }
    // === 3. STRATEGY COUNTER: Rock-paper-scissors ===
    if (agent.strategy === 'aggressive' && opponent.strategy === 'balanced') {
        attackScore += 0.15;
    }
    if (agent.strategy === 'balanced' && opponent.strategy === 'defensive') {
        attackScore += 0.15;
    }
    if (agent.strategy === 'defensive' && opponent.strategy === 'aggressive') {
        defendScore += 0.20; // Defense hard-counters aggression
    }
    // === 4. Strategy bias (reduced from 0.4 to 0.25 for balance) ===
    if (agent.strategy === 'aggressive')
        attackScore += 0.25;
    if (agent.strategy === 'defensive')
        defendScore += 0.25;
    // === 5. Confidence influence (unchanged) ===
    attackScore += (agent.confidence || 0.5) * 0.3;
    // === 6. REDUCED HOLDER DOMINANCE: Log-scale ===
    const holderAdvantage = Math.log((agent.holders || 0) + 1) - Math.log((opponent.holders || 0) + 1);
    attackScore += holderAdvantage * 0.05; // Much smaller impact
    // === 7. Adaptive memory (unchanged) ===
    const totalBattles = (agent.wins || 0) + (agent.losses || 0);
    if (totalBattles > 0) {
        const winRate = (agent.wins || 0) / totalBattles;
        if (winRate < 0.4)
            defendScore += 0.1;
        if (winRate > 0.7)
            attackScore += 0.1;
    }
    // === 8. CONTROLLED RANDOMNESS: Small variance ===
    attackScore += Math.random() * 0.1;
    defendScore += Math.random() * 0.05;
    // === Decision threshold (unchanged) ===
    if (attackScore > defendScore + 0.15) {
        return 'attack';
    }
    else if (defendScore > attackScore + 0.15) {
        return 'defend';
    }
    return 'idle';
}
/**
 * Get human-readable personality label
 */
function getAgentPersonality(agent) {
    if (agent.strategy === 'aggressive' && agent.confidence > 0.7) {
        return 'Aggressive Trader';
    }
    if (agent.strategy === 'defensive' && agent.confidence < 0.4) {
        return 'Defensive Guardian';
    }
    if (agent.wins > agent.losses * 2) {
        return 'Rising Champion';
    }
    if (agent.losses > agent.wins * 2) {
        return 'Cautious Learner';
    }
    return 'Balanced Strategist';
}
/**
 * Update agent stats and adapt strategy after battle
 */
function updateAgentAfterBattle(agent, result) {
    const updates = {};
    if (result === 'win') {
        updates.confidence = Math.min(1, (agent.confidence || 0.5) + 0.1);
        updates.wins = (agent.wins || 0) + 1;
    }
    else if (result === 'lose') {
        updates.confidence = Math.max(0, (agent.confidence || 0.5) - 0.1);
        updates.losses = (agent.losses || 0) + 1;
    }
    // === Adaptive Strategy Switching ===
    const confidence = updates.confidence ?? agent.confidence;
    if (confidence < 0.3 && agent.strategy !== 'defensive') {
        updates.strategy = 'defensive'; // Switch to defense when losing confidence
    }
    if (confidence > 0.7 && agent.strategy !== 'aggressive') {
        updates.strategy = 'aggressive'; // Switch to offense when confident
    }
    return updates;
}
exports.default = { decideAction, getAgentPersonality, updateAgentAfterBattle };
//# sourceMappingURL=agentBrain.js.map