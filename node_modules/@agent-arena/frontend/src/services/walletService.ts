// Solana wallet integration (Phantom)
import { PublicKey, Connection } from '@solana/web3.js';

const RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

export const walletService = {
  async connect(): Promise<string | null> {
    if (!(window as any).solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return null;
    }

    try {
      const response = await (window as any).solana.connect();
      return response.publicKey.toString();
    } catch (err) {
      console.error('Wallet connect failed:', err);
      return null;
    }
  },

  async disconnect(): Promise<void> {
    if ((window as any).solana?.isPhantom) {
      await (window as any).solana.disconnect();
    }
  },

  async getBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await connection.getBalance(pubkey);
      return balance / 1e9; // Convert lamports to SOL
    } catch {
      return 0;
    }
  },

  async signMessage(address: string, message: string): Promise<string | null> {
    try {
      const encoder = new TextEncoder();
      const signed = await (window as any).solana.signMessage(
        encoder.encode(message),
        'utf8'
      );
      return Buffer.from(signed.signature).toString('base64');
    } catch {
      return null;
    }
  },
};