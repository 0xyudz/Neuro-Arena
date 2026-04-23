import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { useState, useCallback } from 'react';
export function useWalletClient() {
    const { publicKey, signTransaction, sendTransaction, connected, connecting } = useWallet();
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const connectWallet = useCallback(async () => {
        try {
            // Wallet adapter auto-connects via modal
            return { success: true };
        }
        catch (error) {
            console.error('Connect wallet error:', error);
            return { success: false, error };
        }
    }, []);
    const signAndSendTransaction = useCallback(async (transactionBase64) => {
        if (!publicKey || !signTransaction || !sendTransaction) {
            throw new Error('Wallet not connected');
        }
        setLoading(true);
        try {
            // Deserialize transaction from base64
            const transactionBuffer = Buffer.from(transactionBase64, 'base64');
            const transaction = VersionedTransaction.deserialize(transactionBuffer);
            // Sign transaction
            const signedTx = await signTransaction(transaction);
            // Send to network
            const signature = await sendTransaction(signedTx, connection);
            // Confirm transaction
            const confirmation = await connection.confirmTransaction(signature, 'processed');
            return {
                success: true,
                signature,
                confirmation,
            };
        }
        catch (error) {
            console.error('Transaction error:', error);
            return {
                success: false,
                error: error.message || 'Transaction failed',
            };
        }
        finally {
            setLoading(false);
        }
    }, [publicKey, signTransaction, sendTransaction, connection]);
    return {
        publicKey,
        connected,
        connecting,
        loading,
        connectWallet,
        signAndSendTransaction,
    };
}
export default useWalletClient;
//# sourceMappingURL=useWalletClient.js.map