import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!connected || !publicKey) return;
    const wallet = publicKey.toString();
    
    Promise.all([
      fetch(`${API_URL}/api/rewards/${wallet}`).then(r => r.json()),
      fetch(`${API_URL}/api/stake/user/${wallet}`).then(r => r.json()),
      fetch(`${API_URL}/api/agents`).then(r => r.json())
    ]).then(([rewardsData, stakesData, allAgents]) => {
      // Calculate best performing agent
      const userAgents = allAgents.filter((a: any) => a.ownerWallet === wallet);
      const bestAgent = userAgents.reduce((best: any, current: any) => {
        const currentRate = current.wins / (current.wins + current.losses || 1);
        const bestRate = best?.wins / (best?.wins + best?.losses || 1);
        return currentRate > bestRate ? current : best;
      }, null);
      
      // Calculate staked agents win rate
      const stakedAgents = stakesData.stakes?.map((s: any) => 
        allAgents.find((a: any) => a.id === s.agentId)
      ).filter(Boolean);
      
      const totalWins = stakedAgents?.reduce((sum: number, a: any) => sum + (a.wins || 0), 0) || 0;
      const totalLosses = stakedAgents?.reduce((sum: number, a: any) => sum + (a.losses || 0), 0) || 0;
      const stakedWinRate = totalWins + totalLosses > 0 
        ? (totalWins / (totalWins + totalLosses)) * 100 
        : 0;
      
      setData({ 
        rewards: rewardsData, 
        stakes: stakesData,
        bestAgent,
        totalRewards: rewardsData.totalRewards || 0,
        stakedWinRate
      });
      setLoading(false);
    }).catch(err => {
      console.error('Profile fetch error:', err);
      setLoading(false);
    });
  }, [connected, publicKey]);

  if (!connected) return <div className="p-10 text-center text-gray-400">Please connect wallet to view profile.</div>;
  if (loading) return <div className="p-10 text-center text-gray-400">Loading profile...</div>;

  // ✅ FIX: Destructure ALL variables from data
  const { rewards, stakes, bestAgent, totalRewards, stakedWinRate } = data || {};
  const totalStaked = stakes?.stakes?.reduce((sum: number, s: any) => sum + s.amount, 0) || 0;
  const unclaimed = rewards?.unclaimed || 0;

  return (
    <motion.div className="space-y-6 max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h1 className="text-2xl font-bold mb-1">Wallet Profile</h1>
        <p className="text-gray-400 font-mono text-sm break-all">{publicKey?.toString() || 'Not connected'}</p>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Best Agent</p>
          <p className="font-bold text-cyan-400 truncate">
            {bestAgent?.name || '—'}
          </p>
          <p className="text-xs text-gray-500">
            {bestAgent?.wins || 0}W / {bestAgent?.losses || 0}L
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Total Earned</p>
          <p className="font-bold text-green-400">
            {totalRewards?.toFixed(2) || '0.00'} 🪙
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Staked Win Rate</p>
          <p className="font-bold text-purple-400">
            {stakedWinRate?.toFixed(1) || '0'}%
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 text-sm">Total Staked</p>
          <p className="text-xl font-bold text-cyan-400">{totalStaked.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 text-sm">Total Rewards</p>
          <p className="text-xl font-bold text-purple-400">{(totalRewards || 0).toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center">
          <p className="text-gray-400 text-sm">Unclaimed</p>
          <p className="text-xl font-bold text-green-400">{unclaimed.toFixed(2)}</p>
        </div>
      </div>

      {/* Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold mb-4">Active Stakes</h3>
          {stakes?.stakes?.length === 0 ? <p className="text-gray-500">No active stakes</p> : (
            <div className="space-y-3">
              {stakes?.stakes?.map((s: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                  <Link to={`/agent/${s.agent?.id}`} className="text-cyan-400 hover:underline font-medium">
                    {s.agent?.name || 'Unknown'} ({s.agent?.tokenSymbol || '?'})
                  </Link>
                  <span className="font-mono text-gray-300">{s.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold mb-4">Recent Rewards</h3>
          {rewards?.rewards?.length === 0 ? <p className="text-gray-500">No rewards yet</p> : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {rewards?.rewards?.map((r: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                  <span className="text-gray-300">{r.agent?.name || 'Unknown'}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${r.claimed ? 'bg-gray-700 text-gray-400' : 'bg-green-900/30 text-green-400'}`}>
                      {r.claimed ? 'Claimed' : 'Pending'}
                    </span>
                    <span className="font-mono text-green-400">+{r.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}