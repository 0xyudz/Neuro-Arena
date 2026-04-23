import { RewardPool } from '../types';

interface RewardPoolCardProps {
  pool: RewardPool;
}

export function RewardPoolCard({ pool }: RewardPoolCardProps) {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Reward Pool</p>
          <p className="text-2xl font-bold text-yellow-400">{pool.poolSize} $ARENA</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Staked</p>
          <p className="text-2xl font-bold text-cyan-400">{pool.totalStaked.toFixed(2)} $ARENA</p>
        </div>
      </div>
    </div>
  );
}