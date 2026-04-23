import { Link } from 'react-router-dom';
import { useArenaStore } from '../store/arenaStore';
import { LeaderboardEntry } from '@agent-arena/shared';

export default function Scoreboard() {
  const { leaderboard, fetchLeaderboard } = useArenaStore();

  // Fetch if empty
  if (leaderboard.length === 0) {
    fetchLeaderboard();
  }

  const topAgents = leaderboard.slice(0, 10);

  return (
    <div className="p-4 rounded-xl bg-arena-card border border-arena-border">
      <h3 className="font-semibold mb-3">🏆 Leaderboard</h3>
      
      <div className="space-y-2">
        {topAgents.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No agents yet</p>
        ) : (
          topAgents.map((entry: LeaderboardEntry) => (
            <Link 
              key={entry.agentId}
              to={`/agent/${entry.agentId}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-arena-border transition-colors group"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                entry.rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                entry.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                'bg-arena-border text-gray-400'
              }`}>
                {entry.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate group-hover:text-arena-primary transition-colors">
                  {entry.name}
                </p>
                <p className="text-xs text-gray-500">{(entry.winRate * 100).toFixed(0)}% win rate</p>
              </div>
              <span className="text-arena-primary font-mono font-bold">{entry.score}</span>
            </Link>
          ))
        )}
      </div>
      
      {leaderboard.length > 10 && (
        <Link 
          to="/marketplace" 
          className="block text-center text-sm text-arena-primary hover:underline mt-3"
        >
          View all agents →
        </Link>
      )}
    </div>
  );
}