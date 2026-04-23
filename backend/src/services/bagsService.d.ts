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
export declare const bagsService: {
    /**
     * Launch a real token on Solana via Bags SDK
     */
    launchToken({ name, symbol, description, owner }: LaunchTokenParams): Promise<{
        success: boolean;
        mint: any;
        signature: any;
        error?: never;
    } | {
        success: boolean;
        error: any;
        mint?: never;
        signature?: never;
    }>;
    /**
     * Get real price quote via Bags SDK
     */
    getQuote({ inputMint, outputMint, amount }: GetQuoteParams): Promise<{
        success: boolean;
        quote: {
            inputAmount: any;
            outputAmount: any;
            priceImpact: any;
            route: any;
        };
        error?: never;
    } | {
        success: boolean;
        error: any;
        quote?: never;
    }>;
    /**
     * Build swap transaction (for frontend to sign)
     */
    buildSwap({ inputMint, outputMint, amount, userPublicKey, slippage, }: GetQuoteParams & {
        userPublicKey: string;
        slippage?: number;
    }): Promise<{
        success: boolean;
        transaction: any;
        instruction: any;
        error?: never;
    } | {
        success: boolean;
        error: any;
        transaction?: never;
        instruction?: never;
    }>;
};
export default bagsService;
//# sourceMappingURL=bagsService.d.ts.map