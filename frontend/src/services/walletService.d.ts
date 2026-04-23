export declare const walletService: {
    connect(): Promise<string | null>;
    disconnect(): Promise<void>;
    getBalance(address: string): Promise<number>;
    signMessage(address: string, message: string): Promise<string | null>;
};
//# sourceMappingURL=walletService.d.ts.map