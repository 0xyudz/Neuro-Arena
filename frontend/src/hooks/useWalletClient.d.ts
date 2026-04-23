import { PublicKey } from '@solana/web3.js';
export declare function useWalletClient(): {
    publicKey: PublicKey | null;
    connected: boolean;
    connecting: boolean;
    loading: boolean;
    connectWallet: () => Promise<{
        success: boolean;
        error?: never;
    } | {
        success: boolean;
        error: unknown;
    }>;
    signAndSendTransaction: (transactionBase64: string) => Promise<{
        success: boolean;
        signature: string;
        confirmation: import("@solana/web3.js").RpcResponseAndContext<import("@solana/web3.js").SignatureResult>;
        error?: never;
    } | {
        success: boolean;
        error: any;
        signature?: never;
        confirmation?: never;
    }>;
};
export default useWalletClient;
//# sourceMappingURL=useWalletClient.d.ts.map