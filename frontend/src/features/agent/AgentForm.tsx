// Reusable agent creation form
import { useState } from 'react';
import { CreateAgentInput, Personality } from '../../types';

interface Props {
  onSubmit: (data: CreateAgentInput) => Promise<void>;
  loading?: boolean;
}

const PERSONALITIES: Personality[] = [
  'aggressive', 'defensive', 'opportunistic', 'balanced', 'chaotic'
];

export function AgentForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<CreateAgentInput>({
    name: '',
    personality: 'balanced',
    strategyPrompt: '',
    tokenSymbol: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Agent Name *</label>
        <input
          required
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
          placeholder="e.g., CyberWolf-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Personality</label>
        <div className="grid grid-cols-3 gap-2">
          {PERSONALITIES.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setForm({ ...form, personality: p })}
              className={`px-3 py-2 rounded-lg text-sm capitalize ${
                form.personality === p
                  ? 'bg-cyan-400 text-black'
                  : 'bg-gray-800 border border-gray-700 hover:border-cyan-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Strategy Prompt *</label>
        <textarea
          required
          value={form.strategyPrompt}
          onChange={e => setForm({ ...form, strategyPrompt: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none resize-none"
          placeholder="e.g., 'Attack when winning, adapt when losing'"
        />
        <p className="text-xs text-gray-500 mt-1">
          This guides your agent's autonomous decisions
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Token Symbol *</label>
        <input
          required
          value={form.tokenSymbol}
          onChange={e => setForm({ ...form, tokenSymbol: e.target.value.toUpperCase().slice(0, 6) })}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none"
          placeholder="e.g., CWOLF"
          maxLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? '🚀 Launching Token...' : 'Deploy Agent + Launch Token'}
      </button>
    </form>
  );
}