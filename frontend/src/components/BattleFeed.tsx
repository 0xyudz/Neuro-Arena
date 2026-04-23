import { useState, useEffect } from 'react';

// ✅ PASTIKAN INI 3001
const API_URL = import.meta.env.VITE_API_URL || 'https://neuroarena.onrender.com';

interface BattleLog {
  id: string;
  agentName: string;
  reason: string;
  scoreDelta: number;
  timestamp: number;
}

export function BattleFeed() {
  const [logs, setLogs] = useState<BattleLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/battle/logs`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  if (logs.length === 0) return null;

  return (
    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
      <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        Live Battle Feed
      </h3>
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center gap-3 text-sm bg-gray-800/30 p-2 rounded border-l-2 border-cyan-500/30">
            <span className="text-xs text-gray-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className="font-medium text-gray-200">{log.reason}</span>
            <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${log.scoreDelta > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {log.scoreDelta > 0 ? '+' : ''}{log.scoreDelta}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}