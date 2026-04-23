import { AgentAction } from '../types/agent';

const ACTION_CONFIG: Record<AgentAction, { emoji: string; color: string; label: string }> = {
  attack: { emoji: '🔥', color: 'text-red-400', label: 'Attacking' },
  defend: { emoji: '🛡️', color: 'text-blue-400', label: 'Defending' },
  adapt:  { emoji: '⚡', color: 'text-yellow-400', label: 'Adapting' },
};

interface Props {
  action: ActionType;
}

export function AgentActionBadge({ action }: Props) {
  const config = ACTION_CONFIG[action] || ACTION_CONFIG.adapt;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-medium ${config.color}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}