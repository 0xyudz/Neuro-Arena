import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Personality, Strategy, AgentAttributes } from '../types/agent';

const API_URL = import.meta.env.VITE_API_URL || 'https://neuroarena.onrender.com';

export function CreateAgentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    personality: 'balanced' as Personality,
    strategy: 'balanced' as Strategy,
    tokenSymbol: '',
    risk: 0.5,
    attributes: {
      risk: 0.5,
      consistency: 0.5,
      speed: 0.5
    } as AgentAttributes,
  });

  const handleNext = () => {
    if (step === 1 && !form.name) {
      alert('Name is required');
      return;
    }
    if (step === 3) {
      handleSubmit();
      return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ✅ Generate random wallets
      const ownerWallet = '0x' + Math.random().toString(16).slice(2).padEnd(40, '0');
      const agentWallet = 'AGENT_' + Math.random().toString(36).slice(2, 10).toUpperCase();
      const tokenMint = 'MINT_' + Math.random().toString(36).slice(2, 10).toUpperCase();
      const tokenSymbol = form.tokenSymbol || form.name.slice(0, 4).toUpperCase();

      const payload = {
        ownerWallet,
        agentWallet,
        tokenSymbol,
        tokenMint,
        name: form.name,
        description: form.description,
        personality: form.personality,
        strategy: form.strategy,  // ✅ Already exists
        imageUrl: form.imageUrl || '',
        risk: form.risk,  // ✅ NEW: Include risk
        confidence: 0.5,  // ✅ NEW: Initialize AI fields
        wins: 0,
        losses: 0,
        score: 100,
        lastAction: 'idle',
        isChampion: false,
        price: 0.0001,
        marketCap: 100000,
        holders: 0,
        volume24h: 0,
        trades: 0,
      };

      console.log('📤 Sending to backend:', payload);

      // ✅ POST ke backend API
      const res = await fetch(`${API_URL}/api/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create agent');
      }

      const createdAgent = await res.json();
      console.log('✅ Agent created:', createdAgent);

      // ✅ Redirect ke halaman agent yang baru dibuat
      navigate(`/agent/${createdAgent.id}`);

    } catch (error) {
      console.error('❌ Create failed:', error);
      alert('Failed to create agent: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const Slider = ({ label, value, onChange }: {
    label: string;
    value: number;
    onChange: (val: number) => void
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        {label}: {value.toFixed(2)}
      </label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deploy AI Agent</h1>
        <span className="text-gray-400">Step {step}/3</span>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
        {/* STEP 1: Identity */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Agent Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition"
                placeholder="CyberWolf-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition h-24"
                placeholder="Describe your agent's capabilities..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
              <input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition"
                placeholder="https://example.com/image.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Token Symbol</label>
              <input
                value={form.tokenSymbol}
                onChange={(e) => setForm({ ...form, tokenSymbol: e.target.value.toUpperCase().slice(0, 6) })}
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition"
                placeholder="WOLF"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Strategy & Attributes */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Strategy</label>
              <select
                value={form.strategy}
                onChange={(e) => setForm({ ...form, strategy: e.target.value as Strategy })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-cyan-400 outline-none transition"
              >
                <option value="aggressive">Aggressive - High risk, high reward</option>
                <option value="balanced">Balanced - Moderate approach</option>
                <option value="defensive">Defensive - Safe and steady</option>
              </select>
            </div>

            {/* Personality Presets */}
            <div className="pt-2">
              <label className="block text-sm font-medium mb-2">Personality Preset</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, strategy: 'aggressive', risk: 0.9 })}
                  className="flex-1 px-3 py-2 text-xs rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
                >
                  🎯 Sniper
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, strategy: 'defensive', risk: 0.2 })}
                  className="flex-1 px-3 py-2 text-xs rounded border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition"
                >
                  🛡️ Guardian
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, strategy: 'balanced', risk: 0.5 })}
                  className="flex-1 px-3 py-2 text-xs rounded border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition"
                >
                  🧠 Strategist
                </button>
              </div>
            </div>

            {/* Risk Slider */}
            <div className="pt-4">
              <label className="block text-sm font-medium mb-2">
                Risk Tolerance: {(form.risk * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={form.risk}
                onChange={(e) => setForm({ ...form, risk: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cautious</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>

            <Slider
              label="Risk"
              value={form.attributes.risk}
              onChange={(val) => setForm({ ...form, attributes: { ...form.attributes, risk: val } })}
            />
            <Slider
              label="Consistency"
              value={form.attributes.consistency}
              onChange={(val) => setForm({ ...form, attributes: { ...form.attributes, consistency: val } })}
            />
            <Slider
              label="Speed"
              value={form.attributes.speed}
              onChange={(val) => setForm({ ...form, attributes: { ...form.attributes, speed: val } })}
            />
          </div>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
              <p>
                <span className="text-gray-400">Name:</span>{' '}
                <span className="font-bold">{form.name}</span>
              </p>
              <p>
                <span className="text-gray-400">Description:</span>{' '}
                {form.description || '-'}
              </p>
              <p>
                <span className="text-gray-400">Strategy:</span>{' '}
                <span className="text-cyan-400 capitalize">{form.strategy}</span>
              </p>
              <p>
                <span className="text-gray-400">Personality:</span>{' '}
                <span className="text-purple-400 capitalize">{form.personality}</span>
              </p>
              <p>
                <span className="text-gray-400">Token Symbol:</span>{' '}
                {form.tokenSymbol || form.name.slice(0, 4).toUpperCase()}
              </p>
              <div className="pt-2 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Attributes:</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-700 p-2 rounded text-center">
                    <span className="text-gray-400 block">Risk</span>
                    <span className="font-mono">{form.attributes.risk.toFixed(2)}</span>
                  </div>
                  <div className="bg-gray-700 p-2 rounded text-center">
                    <span className="text-gray-400 block">Consistency</span>
                    <span className="font-mono">{form.attributes.consistency.toFixed(2)}</span>
                  </div>
                  <div className="bg-gray-700 p-2 rounded text-center">
                    <span className="text-gray-400 block">Speed</span>
                    <span className="font-mono">{form.attributes.speed.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ This will deploy your agent to the Arena and mint its token.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deploying...' : step === 3 ? 'Confirm & Deploy' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}