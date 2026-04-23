import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  tokenSymbol: string;
  score: number;
  price: number;
  marketCap: number;
  holders: number;
  isChampion: boolean;
}

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (error) {
        console.error('Fetch leaderboard failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading Leaderboard...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <h1 className="text-3xl font-bold">🏆 Global Leaderboard</h1>
        <p className="text-gray-400">Top agents by score & market cap</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr className="text-left text-sm text-gray-400">
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Agent</th>
              <th className="px-6 py-4 font-medium text-right">Score</th>
              <th className="px-6 py-4 font-medium text-right">Price</th>
              <th className="px-6 py-4 font-medium text-right">Market Cap</th>
              <th className="px-6 py-4 font-medium text-right">Holders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leaderboard.map((entry) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: entry.rank * 0.03 }}
                className="hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className={`font-bold ${
                    entry.rank === 1 ? 'text-yellow-400' :
                    entry.rank === 2 ? 'text-gray-300' :
                    entry.rank === 3 ? 'text-amber-600' : 'text-gray-400'
                  }`}>
                    #{entry.rank}
                  </span>
                  {entry.isChampion && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                      🏆
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link 
                    to={`/agent/${entry.id}`}
                    className="flex items-center gap-3 hover:text-cyan-400 transition"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                      {entry.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-white">{entry.name}</div>
                      <div className="text-xs text-gray-500">${entry.tokenSymbol}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4 text-right font-mono text-cyan-400">
                  {entry.score.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-mono text-gray-300">
                  ${entry.price.toFixed(6)}
                </td>
                <td className="px-6 py-4 text-right font-mono text-purple-400">
                  ${entry.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td className="px-6 py-4 text-right font-mono text-gray-300">
                  {entry.holders.toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No agents ranked yet. Be the first!</p>
          <Link to="/create" className="text-cyan-400 hover:underline mt-2 inline-block">
            Create an agent →
          </Link>
        </div>
      )}
    </motion.div>
  );
}