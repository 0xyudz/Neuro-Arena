"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const bagsService_1 = require("../services/bagsService");
const router = (0, express_1.Router)();
// ✅ Format agent response - SYNTAX SUDAH DIPERBAIKI
function formatAgent(agent) {
    return {
        id: agent.id,
        ownerWallet: agent.ownerWallet,
        agentWallet: agent.agentWallet,
        tokenSymbol: agent.tokenSymbol,
        tokenMint: agent.tokenMint,
        // ✅ PERHATIKAN: 'meta' dengan titik dua
        meta: {
            name: agent.name,
            description: agent.description,
            personality: agent.personality,
            strategy: agent.strategy,
            imageUrl: agent.imageUrl,
            services: []
        },
        attributes: {
            risk: 0.5,
            consistency: 0.5,
            speed: 0.5
        },
        runtime: {
            score: agent.score,
            lastAction: agent.lastAction,
            lastActiveAt: agent.updatedAt?.getTime() || Date.now(),
            state: 'active',
            actionCount: agent.trades || 0,
            isChampion: agent.isChampion || false,
            history: agent.battleLogs?.map((log) => ({
                opponentId: log.opponentId,
                opponentName: 'Opponent',
                result: log.result,
                scoreChange: log.scoreChange,
                priceChange: log.priceChange,
                timestamp: log.timestamp?.getTime() || Date.now()
            })) || []
        },
        financial: {
            price: agent.price,
            totalStake: agent.volume24h || 0,
            priceChange: agent.priceChange || 0,
            volume24h: agent.volume24h || 0
        },
        token: agent.price > 0 ? {
            mint: agent.tokenMint,
            name: agent.name,
            symbol: agent.tokenSymbol,
            description: agent.description || '',
            imageUrl: agent.imageUrl || '',
            supply: 1000000000,
            circulatingSupply: (agent.holders || 0) * 1000000,
            price: agent.price,
            previousPrice: agent.price,
            priceChange: agent.priceChange || 0,
            marketCap: agent.marketCap || 0,
            volume24h: agent.volume24h || 0,
            trades: agent.trades || 0,
            holders: agent.holders || 0,
            createdAt: agent.createdAt?.getTime() || Date.now(),
            transactions: agent.transactions?.map((tx) => ({
                type: tx.type,
                amount: tx.amount,
                price: tx.price,
                timestamp: tx.timestamp?.getTime() || Date.now()
            })) || []
        } : undefined
    };
}
// GET /api/agents
router.get('/', async (req, res) => {
    try {
        const agents = await database_1.prisma.agent.findMany({
            orderBy: { score: 'desc' }
        });
        res.json(agents.map(formatAgent));
    }
    catch (error) {
        console.error('Fetch agents error:', error);
        res.status(500).json({ error: 'Failed to fetch agents' });
    }
});
// POST /api/agents - Create new agent (existing code + Bags integration)
router.post('/', async (req, res) => {
    try {
        console.log('📥 Create agent request:', req.body);
        const { ownerWallet, agentWallet, tokenSymbol, tokenMint, name, description, personality, strategy, imageUrl, launchRealToken = false, // ✅ NEW: Flag untuk launch real token
         } = req.body;
        // ✅ BAGS INTEGRATION: Launch real token if requested
        let realMintAddress = tokenMint;
        if (launchRealToken && process.env.BAGS_API_KEY) {
            console.log('🚀 Launching real token via Bags SDK...');
            const launchResult = await bagsService_1.bagsService.launchToken({
                name,
                symbol: tokenSymbol,
                description: description || `${name} token`,
                owner: ownerWallet,
            });
            if (launchResult.success && launchResult.mint) {
                realMintAddress = launchResult.mint;
                console.log('✅ Real token launched:', realMintAddress);
            }
            else {
                console.warn('⚠️ Bags launch failed, using mock mint');
            }
        }
        // ✅ Existing Prisma logic (UNCHANGED)
        const agent = await database_1.prisma.agent.create({
            data: {
                ownerWallet,
                agentWallet,
                tokenSymbol,
                tokenMint: realMintAddress, // ✅ Use real mint if available
                name,
                description: description || null,
                personality: personality || 'balanced',
                strategy: strategy || 'balanced',
                imageUrl: imageUrl || null,
                score: 100,
                lastAction: 'idle',
                isChampion: false,
                price: 0.0001,
                marketCap: 100000,
                holders: 0,
                volume24h: 0,
                trades: 0,
            }
        });
        console.log('✅ Agent created:', agent.id);
        res.status(201).json(formatAgent(agent));
    }
    catch (error) {
        console.error('❌ Create agent error:', error);
        res.status(500).json({
            error: 'Failed to create agent',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// GET /api/agents/:id
router.get('/:id', async (req, res) => {
    try {
        const agent = await database_1.prisma.agent.findUnique({
            where: { id: req.params.id },
            include: {
                transactions: { orderBy: { timestamp: 'desc' }, take: 10 },
                battleLogs: { orderBy: { timestamp: 'desc' }, take: 10 }
            }
        });
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        res.json(formatAgent(agent));
    }
    catch (error) {
        console.error('Fetch agent error:', error);
        res.status(500).json({ error: 'Failed to fetch agent' });
    }
});
// POST /api/agents/:id/boost
router.post('/:id/boost', async (req, res) => {
    try {
        const agent = await database_1.prisma.agent.findUnique({
            where: { id: req.params.id }
        });
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        const updated = await database_1.prisma.agent.update({
            where: { id: req.params.id },
            data: {
                score: agent.score + 10,
                price: agent.price * 1.03,
                marketCap: agent.price * 1.03 * 1000000000,
                priceChange: 3,
                lastAction: 'adapt'
            }
        });
        res.json({ success: true, agent: formatAgent(updated) });
    }
    catch (error) {
        console.error('Boost error:', error);
        res.status(500).json({ error: 'Failed to boost agent' });
    }
});
// POST /api/quote - Get real price quote via Bags SDK
router.post('/quote', async (req, res) => {
    try {
        const { inputMint, outputMint, amount } = req.body;
        if (!inputMint || !outputMint || !amount) {
            return res.status(400).json({
                error: 'Missing required fields: inputMint, outputMint, amount'
            });
        }
        const result = await bagsService_1.bagsService.getQuote({
            inputMint,
            outputMint,
            amount,
        });
        if (result.success) {
            res.json({ success: true, quote: result.quote });
        }
        else {
            res.status(500).json({ error: result.error });
        }
    }
    catch (err) {
        console.error('Quote route error:', err);
        res.status(500).json({ error: 'Quote failed' });
    }
});
// POST /api/swap/build - Build swap transaction (optional, for frontend signing)
router.post('/swap/build', async (req, res) => {
    try {
        const { inputMint, outputMint, amount, userPublicKey, slippage } = req.body;
        if (!inputMint || !outputMint || !amount || !userPublicKey) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }
        const result = await bagsService_1.bagsService.buildSwap({
            inputMint,
            outputMint,
            amount,
            userPublicKey,
            slippage,
        });
        if (result.success) {
            res.json({
                success: true,
                transaction: result.transaction,
                instruction: result.instruction
            });
        }
        else {
            res.status(500).json({ error: result.error });
        }
    }
    catch (err) {
        console.error('Build swap error:', err);
        res.status(500).json({ error: 'Build swap failed' });
    }
});
exports.default = router;
//# sourceMappingURL=agents.js.map