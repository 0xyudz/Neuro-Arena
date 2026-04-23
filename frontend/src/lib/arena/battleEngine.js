import { Agent, BattleRecord } from '../../types/agent';
function calcAttack(agent) {
    const { risk, speed } = agent.attributes || { risk: 0.5, speed: 0.5 };
    // ✅ VIRAL BOOST: More holders = stronger agent
    const holderBoost = Math.log((agent.token?.holders || 0) + 1);
    return (risk * 1.5 + speed + holderBoost) * (0.9 + Math.random() * 0.2);
}
function calcDefense(agent) {
    const { consistency } = agent.attributes || { consistency: 0.5 };
    return consistency * 1.5 * (0.9 + Math.random() * 0.2);
}
function applyStrategy(agent, baseValue) {
    const strat = agent.metadata?.strategy;
    if (strat === 'aggressive')
        return baseValue * 1.15;
    if (strat === 'defensive')
        return baseValue * 0.95;
    return baseValue;
}
export function runBattle(agentA, agentB) {
    const aPower = applyStrategy(agentA, calcAttack(agentA) * 0.7 + calcDefense(agentA) * 0.3);
    const bPower = applyStrategy(agentB, calcAttack(agentB) * 0.7 + calcDefense(agentB) * 0.3);
    const winner = aPower > bPower ? agentA.id : agentB.id;
    const loser = winner === agentA.id ? agentB.id : agentA.id;
    // ✅ ENHANCED VOLATILITY
    const winPriceBoost = 0.10 + Math.random() * 0.15;
    const losePriceDrop = 0.05 + Math.random() * 0.10;
    return {
        winner,
        loser,
        winnerScoreChange: 20,
        loserScoreChange: -10,
        winnerPriceChange: winPriceBoost * 100,
        loserPriceChange: -losePriceDrop * 100,
    };
}
export function updateAgentAfterBattle(agent, result, isWinner) {
    const scoreChange = isWinner ? result.winnerScoreChange : result.loserScoreChange;
    const priceChange = isWinner ? result.winnerPriceChange : result.loserPriceChange;
    const newScore = Math.max(0, (agent.runtime?.score || 0) + scoreChange);
    const wasChampion = agent.runtime?.isChampion;
    const isChampion = newScore >= 500 || wasChampion;
    const championBonus = isChampion && !wasChampion ? 0.50 : 0;
    let updatedToken = agent.token ? { ...agent.token } : undefined;
    if (updatedToken && priceChange !== 0) {
        const prevPrice = updatedToken.price;
        const totalPriceChange = priceChange / 100 + championBonus;
        const newPrice = Math.max(0.00000001, prevPrice * (1 + totalPriceChange));
        updatedToken = {
            ...updatedToken,
            previousPrice: prevPrice,
            price: newPrice,
            priceChange: totalPriceChange * 100,
            marketCap: newPrice * updatedToken.supply,
        };
    }
    const battle = {
        opponentId: isWinner ? result.loser : result.winner,
        opponentName: 'Opponent',
        result: isWinner ? 'win' : 'lose',
        scoreChange,
        priceChange: updatedToken?.priceChange || 0,
        timestamp: Date.now(),
    };
    return {
        runtime: {
            ...agent.runtime,
            score: newScore,
            lastAction: isWinner ? 'win' : 'lose',
            lastActiveAt: Date.now(),
            isChampion,
            history: [battle, ...(agent.runtime?.history || [])].slice(0, 10),
        },
        token: updatedToken,
    };
}
export function boostAgent(agent) {
    const scoreBoost = 10;
    const priceBoost = 0.03;
    let updatedToken = agent.token ? { ...agent.token } : undefined;
    if (updatedToken) {
        const newPrice = updatedToken.price * (1 + priceBoost);
        updatedToken = { ...updatedToken, previousPrice: updatedToken.price, price: newPrice, priceChange: priceBoost * 100, marketCap: newPrice * updatedToken.supply };
    }
    return { runtime: { ...agent.runtime, score: (agent.runtime?.score || 0) + scoreBoost, lastAction: 'adapt', lastActiveAt: Date.now() }, token: updatedToken };
}
//# sourceMappingURL=battleEngine.js.map