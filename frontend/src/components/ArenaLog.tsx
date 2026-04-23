import { BattleLog } from '../types/agent';

interface Props {
  logs: BattleLog[];
  title?: string;
}

export function ArenaLog({ logs, title = 'Battle Log' }: Props) {
  const actionIcon: Record<string, string> = { attack: '🔥', defend: '🛡️', adapt: '⚡' };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 h-64 overflow-hidden flex flex-col">
      <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase">{title}</h3>
      <div className="flex-1 overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">Waiting for actions...</p>
        ) : (
          logs.map(log => (
            <div key={log.id} className="flex items-center justify-between text-xs border-b border-gray-800 pb-1 last:border-0">
              <span className="text-gray-300">{log.agentId.slice(0, 8)}...</span>
              <span className="flex items-center gap-1">
                {actionIcon[log.action]} {log.action}
              </span>
              <span className={`font-mono ${log.scoreDelta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {log.scoreDelta >= 0 ? '+' : ''}{log.scoreDelta.toFixed(1)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}