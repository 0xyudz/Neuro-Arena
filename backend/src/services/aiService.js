"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const shared_1 = require("@agent-arena/shared");
/**
 * Simple AI suggestion service - minimal implementation
 * Returns weighted action suggestions based on agent state
 * Does NOT call external LLM APIs (keep it simple)
 */
exports.aiService = {
    /**
     * Suggest an action for an agent based on simple heuristics
     * @param agent - The agent making the decision
     * @param allAgents - All agents in the arena
     * @param defaultAction - Fallback action if logic doesn't decide
     */
    async suggestAction(agent, allAgents, defaultAction) {
        // Keep it simple: only override default in specific scenarios
        const opponents = allAgents.filter(a => a.id !== agent.id);
        if (opponents.length === 0)
            return null;
        // If agent is far behind, suggest aggressive play
        const avgScore = opponents.reduce((sum, a) => sum + a.score, 0) / opponents.length;
        if (agent.score < avgScore * 0.5 && agent.personality !== 'defensive') {
            const weakTarget = opponents.sort((a, b) => a.score - b.score)[0];
            return { action: 'attack', target: weakTarget.id };
        }
        // If agent is far ahead, suggest defensive play
        if (agent.score > avgScore * 1.5 && agent.personality !== 'aggressive') {
            return { action: 'defend' };
        }
        // Social personality: occasionally ally
        if (agent.personality === 'social' && Math.random() < 0.3) {
            const potentialAlly = opponents.sort((a, b) => b.score - a.score)[0];
            return { action: 'ally', target: potentialAlly.id };
        }
        // Default: no override
        return null;
    },
    /**
     * Generate a simple "thought" string for logging/display
     * Purely cosmetic - no actual AI reasoning
     */
    generateThought(agent, action, result) {
        const thoughts = {
            attack: [
                "Calculating optimal strike vector...",
                "Target vulnerability detected.",
                "Executing aggressive maneuver."
            ],
            defend: [
                "Reinforcing defensive protocols.",
                "Analyzing incoming threat patterns.",
                "Activating shield matrix."
            ],
            boost: [
                "Optimizing performance parameters.",
                "Allocating resources to core systems.",
                "Initiating self-improvement cycle."
            ],
            retreat: [
                "Strategic repositioning initiated.",
                "Preserving resources for future engagement.",
                "Evaluating alternative approaches."
            ],
            observe: [
                "Gathering intelligence on arena state.",
                "Processing opponent behavior patterns.",
                "Updating strategic model."
            ],
            ally: [
                "Evaluating partnership synergies.",
                "Proposing cooperative strategy.",
                "Establishing trust protocol."
            ]
        };
        const options = thoughts[action] || ["Processing..."];
        return options[Math.floor(Math.random() * options.length)];
    }
};
//# sourceMappingURL=aiService.js.map