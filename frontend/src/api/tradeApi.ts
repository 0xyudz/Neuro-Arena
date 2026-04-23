const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface QuoteRequest {
  inputMint: string;
  outputMint: string;
  amount: number;
}

export interface QuoteResponse {
  success: boolean;
  quote?: {
    inputAmount: number;
    outputAmount: number;
    priceImpact: number;
    route: any[];
  };
  error?: string;
}

export interface BuildSwapRequest {
  inputMint: string;
  outputMint: string;
  amount: number;
  userPublicKey: string;
  slippage?: number;
}

export interface BuildSwapResponse {
  success: boolean;
  transaction?: string; // Base64 encoded
  instruction?: any;
  error?: string;
}

export const tradeApi = {
  async getQuote(request: QuoteRequest): Promise<QuoteResponse> {
    try {
      const response = await fetch(`${API_URL}/api/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      return await response.json();
    } catch (error: any) {
      console.error('Get quote error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get quote',
      };
    }
  },

  async buildSwap(request: BuildSwapRequest): Promise<BuildSwapResponse> {
    try {
      const response = await fetch(`${API_URL}/api/swap/build`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      return await response.json();
    } catch (error: any) {
      console.error('Build swap error:', error);
      return {
        success: false,
        error: error.message || 'Failed to build swap',
      };
    }
  },

  async buyToken(agentId: string, amount: number): Promise<QuoteResponse> {
    // SOL -> Agent Token
    return this.getQuote({
      inputMint: 'So11111111111111111111111111111111111111112', // SOL
      outputMint: agentId, // Agent token mint
      amount,
    });
  },

  async sellToken(agentMint: string, amount: number): Promise<QuoteResponse> {
    // Agent Token -> SOL
    return this.getQuote({
      inputMint: agentMint, // Agent token
      outputMint: 'So11111111111111111111111111111111111111112', // SOL
      amount,
    });
  },
};

export default tradeApi;