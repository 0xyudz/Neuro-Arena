// frontend/src/hooks/useArena.ts
import { useState, useEffect } from 'react';
import { AgentLog } from '../lib/agents/log';
import { AgentLogEntry } from '../types/agent';

export function useArena() {
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [stats, setStats] = useState({ totalActions: 0, avgScore: 0 });

  useEffect(() => {
    const update = () => {
      setLogs(AgentLog.get(20));
      const allLogs = AgentLog.get(100);
      setStats({
        totalActions: allLogs.length,
        avgScore: allLogs.reduce((s, l) => s + l.scoreDelta, 0) / Math.max(1, allLogs.length),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { logs, stats };
}