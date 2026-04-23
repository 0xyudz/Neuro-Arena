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
    transaction?: string;
    instruction?: any;
    error?: string;
}
export declare const tradeApi: {
    getQuote(request: QuoteRequest): Promise<QuoteResponse>;
    buildSwap(request: BuildSwapRequest): Promise<BuildSwapResponse>;
    buyToken(agentId: string, amount: number): Promise<QuoteResponse>;
    sellToken(agentMint: string, amount: number): Promise<QuoteResponse>;
};
export default tradeApi;
//# sourceMappingURL=tradeApi.d.ts.map