// Wallet connect button component
import { useWallet } from '../hooks/useWallet';

export function WalletButton() {
  const { wallet, connect, disconnect, loading } = useWallet();

  if (wallet.connected && wallet.address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400">Connected</p>
          <p className="text-sm font-mono text-cyan-400">
            {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
          </p>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-black font-bold hover:opacity-90 disabled:opacity-50"
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}