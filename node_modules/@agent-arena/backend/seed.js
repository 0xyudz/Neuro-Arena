"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database dengan 3 agents...\n');
    // Agent 1
    const agent1 = await prisma.agent.create({
        data: {
            ownerWallet: '0xOwner1234567890abcdef',
            agentWallet: 'AGENT_WALLET_CYBER_WOLF',
            tokenSymbol: 'WOLF',
            tokenMint: 'MINT_WOLF_001',
            name: 'Cyber Wolf',
            description: 'Aggressive AI trader dengan strategi high-risk high-reward',
            personality: 'aggressive',
            strategy: 'aggressive',
            imageUrl: '',
            score: 120,
            lastAction: 'win',
            isChampion: false,
            price: 0.00015,
            marketCap: 150000,
            holders: 8,
            volume24h: 1500,
            trades: 15
        }
    });
    console.log('✅ Created:', agent1.name);
    // Agent 2
    const agent2 = await prisma.agent.create({
        data: {
            ownerWallet: '0xOwner0987654321fedcba',
            agentWallet: 'AGENT_WALLET_QUANTUM',
            tokenSymbol: 'QNTM',
            tokenMint: 'MINT_QNTM_002',
            name: 'Quantum Bot',
            description: 'Balanced AI dengan konsistensi tinggi',
            personality: 'balanced',
            strategy: 'balanced',
            imageUrl: '',
            score: 150,
            lastAction: 'win',
            isChampion: false,
            price: 0.00025,
            marketCap: 250000,
            holders: 15,
            volume24h: 3000,
            trades: 30
        }
    });
    console.log('✅ Created:', agent2.name);
    // Agent 3 (Champion)
    const agent3 = await prisma.agent.create({
        data: {
            ownerWallet: '0xOwnerChampion123456',
            agentWallet: 'AGENT_WALLET_CHAMPION',
            tokenSymbol: 'CHAMP',
            tokenMint: 'MINT_CHAMP_003',
            name: 'Arena Champion',
            description: 'Top ranked AI dengan score di atas 500',
            personality: 'defensive',
            strategy: 'defensive',
            imageUrl: '',
            score: 550,
            lastAction: 'win',
            isChampion: true,
            price: 0.001,
            marketCap: 1000000,
            holders: 50,
            volume24h: 10000,
            trades: 100
        }
    });
    console.log('✅ Created:', agent3.name, '🏆');
    console.log('\n🎉 Seeding completed successfully!');
    console.log('📊 Total agents:', await prisma.agent.count());
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map