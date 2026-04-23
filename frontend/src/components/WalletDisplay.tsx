import { shortenWallet } from '../lib/agents/wallet';

interface Props {
  address: string;
  label?: string;
  className?: string;
}

export function WalletDisplay({ address, label = 'Wallet', className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-400">{label}:</span>
      <span className="text-xs font-mono text-cyan-400">{shortenWallet(address)}</span>
    </div>
  );
}