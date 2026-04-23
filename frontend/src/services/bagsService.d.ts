interface TokenLaunchParams {
    name: string;
    symbol: string;
    description: string;
    imageUrl?: string;
}
interface LaunchResult {
    success: boolean;
    mint?: string;
    error?: string;
}
export declare const bagsService: {
    launchToken(params: TokenLaunchParams): Promise<LaunchResult>;
    mockLaunch(params: TokenLaunchParams): Promise<LaunchResult>;
    getTokenInfo(mint: string): Promise<{
        symbol: string;
        price: number;
        supply: number;
    } | null>;
};
export {};
//# sourceMappingURL=bagsService.d.ts.map