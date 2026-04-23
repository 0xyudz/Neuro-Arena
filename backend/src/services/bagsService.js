"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bagsService = void 0;
const bags_sdk_1 = require("@bagsfm/bags-sdk");
const web3_js_1 = require("@solana/web3.js");
// Initialize Solana connection
const connection = new web3_js_1.Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com', 'processed');
// Initialize Bags SDK
const sdk = new bags_sdk_1.BagsSDK(process.env.BAGS_API_KEY, connection, 'processed');
exports.bagsService = {
    /**
     * Launch a real token on Solana via Bags SDK
     */
    async launchToken({ name, symbol, description, owner }) {
        try {
            // Bags SDK token launch
            const result = await sdk.tokenLaunch.createTokenLaunch({
                name,
                symbol,
                description,
                // owner wallet optional - Bags handles signer internally
            });
            return {
                success: true,
                mint: result.mintAddress,
                signature: result.signature,
            };
        }
        catch (err) {
            console.error('Bags launch error:', err);
            return {
                success: false,
                error: err.message || 'Token launch failed',
            };
        }
    },
    /**
     * Get real price quote via Bags SDK
     */
    async getQuote({ inputMint, outputMint, amount }) {
        try {
            const quote = await sdk.trade.getQuote({
                inputMint,
                outputMint,
                amount,
                slippageMode: 'dynamic',
            });
            return {
                success: true,
                quote: {
                    inputAmount: quote.inputAmount,
                    outputAmount: quote.outputAmount,
                    priceImpact: quote.priceImpact,
                    route: quote.route,
                },
            };
        }
        catch (err) {
            console.error('Quote error:', err);
            return {
                success: false,
                error: err.message || 'Quote failed',
            };
        }
    },
    /**
     * Build swap transaction (for frontend to sign)
     */
    async buildSwap({ inputMint, outputMint, amount, userPublicKey, slippage = 1, }) {
        try {
            const swap = await sdk.trade.buildSwap({
                inputMint,
                outputMint,
                amount,
                userPublicKey,
                slippageBps: slippage * 100,
            });
            return {
                success: true,
                transaction: swap.transaction,
                instruction: swap.instruction,
            };
        }
        catch (err) {
            console.error('Build swap error:', err);
            return {
                success: false,
                error: err.message || 'Build swap failed',
            };
        }
    },
};
exports.default = exports.bagsService;
//# sourceMappingURL=bagsService.js.map