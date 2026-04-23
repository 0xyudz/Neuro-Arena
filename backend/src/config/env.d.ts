export declare const config: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    WS_PORT: number;
    DATABASE_URL: string;
    SOLANA_RPC_URL: string;
    BAGS_API_KEY?: string | undefined;
    PRIVATE_KEY?: string | undefined;
};
export declare function logStartupInfo(): void;
export declare const isMockMode: boolean;
//# sourceMappingURL=env.d.ts.map