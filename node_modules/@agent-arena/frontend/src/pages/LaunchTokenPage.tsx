import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentRegistry } from '../lib/agents/registry';
import { calculatePrice, calculateMarketCap } from '../utils/bondingCurve';

export function LaunchTokenPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    imageUrl: '',
    initialSupply: 1000000000,
  });

  const agent = id ? AgentRegistry.getAgentById(id) : null;

  if (!agent) return <div className="p-10 text-center text-red-400">Agent not found.</div>;

  const handleLaunch = () => {
    if (!id) return;

    const mint = 'MINT_' + Math.random().toString(36).substring(2, 15).toUpperCase();
    const currentSupply = 0;
    const price = calculatePrice(currentSupply);
    const marketCap = calculateMarketCap(price, formData.initialSupply);

    const tokenData = {
      mint,
      name: formData.name,
      symbol: formData.symbol,
      description: formData.description,
      imageUrl: formData.imageUrl,
      supply: formData.initialSupply,
      circulatingSupply: currentSupply,
      price,
      marketCap,
      createdAt: Date.now(),
      transactions: [],
    };

    AgentRegistry.updateAgent(id, { token: tokenData as any });
    navigate(`/agent/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Launch Token for {agent.metadata?.name || (agent as any).name}</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
        
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Token Name *</label>
              <input 
                required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700" 
                placeholder="e.g. WolfCoin" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Symbol *</label>
              <input 
                required value={formData.symbol} onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700" 
                placeholder="e.g. WOLF" 
                maxLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Total Supply</label>
              <input 
                type="number" value={formData.initialSupply} onChange={e => setFormData({...formData, initialSupply: Number(e.target.value)})} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 h-24" 
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg space-y-2">
              <p><span className="text-gray-400">Name:</span> {formData.name}</p>
              <p><span className="text-gray-400">Symbol:</span> {formData.symbol}</p>
              <p><span className="text-gray-400">Supply:</span> {formData.initialSupply.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700">Back</button>}
          {step < 2 ? (
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg bg-cyan-500 text-black font-bold">Review</button>
          ) : (
            <button onClick={handleLaunch} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold hover:opacity-90">
              🚀 Launch Token
            </button>
          )}
        </div>
      </div>
    </div>
  );
}