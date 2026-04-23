// Solana wallet integration (Phantom)
import { PublicKey, Connection } from '@solana/web3.js';
const RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');
export const walletService = {
    async connect() {
        if (!window.solana?.isPhantom) {
            window.open('https://phantom.app/', '_blank');
            return null;
        }
        try {
            const response = await window.solana.connect();
            return response.publicKey.toString();
        }
        catch (err) {
            console.error('Wallet connect failed:', err);
            return null;
        }
    },
    async disconnect() {
        if (window.solana?.isPhantom) {
            await window.solana.disconnect();
        }
    },
    async getBalance(address) {
        try {
            const pubkey = new PublicKey(address);
            const balance = await connection.getBalance(pubkey);
            return balance / 1e9; // Convert lamports to SOL
        }
        catch {
            return 0;
        }
    },
    async signMessage(address, message) {
        try {
            const encoder = new TextEncoder();
            const signed = await window.solana.signMessage(encoder.encode(message), 'utf8');
            return Buffer.from(signed.signature).toString('base64');
        }
        catch {
            return null;
        }
    },
};
//# sourceMappingURL=walletService.js.map