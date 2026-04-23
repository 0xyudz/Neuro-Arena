const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const tradeApi = {
    async getQuote(request) {
        try {
            const response = await fetch(`${API_URL}/api/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });
            return await response.json();
        }
        catch (error) {
            console.error('Get quote error:', error);
            return {
                success: false,
                error: error.message || 'Failed to get quote',
            };
        }
    },
    async buildSwap(request) {
        try {
            const response = await fetch(`${API_URL}/api/swap/build`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });
            return await response.json();
        }
        catch (error) {
            console.error('Build swap error:', error);
            return {
                success: false,
                error: error.message || 'Failed to build swap',
            };
        }
    },
    async buyToken(agentId, amount) {
        // SOL -> Agent Token
        return this.getQuote({
            inputMint: 'So11111111111111111111111111111111111111112', // SOL
            outputMint: agentId, // Agent token mint
            amount,
        });
    },
    async sellToken(agentMint, amount) {
        // Agent Token -> SOL
        return this.getQuote({
            inputMint: agentMint, // Agent token
            outputMint: 'So11111111111111111111111111111111111111112', // SOL
            amount,
        });
    },
};
export default tradeApi;
//# sourceMappingURL=tradeApi.js.map