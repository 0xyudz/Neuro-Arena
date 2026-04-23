import { BagsSDK } from '@bagsfm/bags-sdk';
import { Connection } from '@solana/web3.js';

// Initialize Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'processed'
);

// Initialize Bags SDK
const sdk = new BagsSDK(
  process.env.BAGS_API_KEY!,
  connection,
  'processed'
);

export interface LaunchTokenParams {
  name: string;
  symbol: string;
  description: string;
  owner?: string;
}

export interface GetQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
}

export const bagsService = {
  /**
   * Launch a real token on Solana via Bags SDK
   */
  async launchToken({ name, symbol, description, owner }: LaunchTokenParams) {
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
    } catch (err: any) {
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
  async getQuote({ inputMint, outputMint, amount }: GetQuoteParams) {
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
    } catch (err: any) {
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
  async buildSwap({
    inputMint,
    outputMint,
    amount,
    userPublicKey,
    slippage = 1,
  }: GetQuoteParams & { userPublicKey: string; slippage?: number }) {
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
    } catch (err: any) {
      console.error('Build swap error:', err);
      return {
        success: false,
        error: err.message || 'Build swap failed',
      };
    }
  },
};

export default bagsService;