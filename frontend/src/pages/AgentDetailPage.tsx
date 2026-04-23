import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Agent } from '../types/agent';
import { shortenWallet } from '../lib/agents/wallet';
import { useWallet } from '@solana/wallet-adapter-react';

const API_URL = 'http://localhost:3001';

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [tradeAmount, setTradeAmount] = useState(1000);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: User position state
  const { publicKey, connected } = useWallet();
  const [userStats, setUserStats] = useState({
    totalStaked: 0,
    totalRewards: 0,
    unclaimedRewards: 0
  });

  // Fetch agent from backend
  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const fetchAgent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/agents/${id}`);
        if (res.ok && mounted) {
          const data = await res.json();
          setAgent(data);
        }
      } catch (error) {
        console.error('Fetch agent failed:', error);
      }
    };

    fetchAgent();
    const interval = setInterval(fetchAgent, 2000);
    return () => { mounted = false; clearInterval(interval); };
  }, [id]);

  // ✅ NEW: Fetch user stats for this agent
  useEffect(() => {
    if (!connected || !publicKey || !id) return;

    const wallet = publicKey.toString();

    Promise.all([
      fetch(`${API_URL}/api/stake/user/${wallet}`).then(r => r.json()),
      fetch(`${API_URL}/api/rewards/${wallet}`).then(r => r.json())
    ]).then(([stakesData, rewardsData]) => {
      const myStakes = stakesData.stakes?.filter((s: any) => s.agentId === id) || [];
      const myRewards = rewardsData.rewards?.filter((r: any) => r.agentId === id) || [];

      setUserStats({
        totalStaked: myStakes.reduce((sum: number, s: any) => sum + s.amount, 0),
        totalRewards: myRewards.reduce((sum: number, r: any) => sum + r.amount, 0),
        unclaimedRewards: myRewards.filter((r: any) => !r.claimed).reduce((sum: number, r: any) => sum + r.amount, 0)
      });
    }).catch(() => { });
  }, [connected, publicKey, id]);

  if (!agent) return <div className="p-10 text-center text-gray-400">Loading agent...</div>;

  const metadata = agent.metadata || (agent as any);
  const name = metadata?.name || `Agent ${agent.id?.slice(0, 8)}`;
  const description = metadata?.description || 'No description provided';
  const imageUrl = metadata?.imageUrl;
  const personality = metadata?.personality || 'balanced';
  const strategy = metadata?.strategy || 'balanced';

  const token = agent.token;
  const runtime = agent.runtime || {};
  const financial = agent.financial || {};

  const score = runtime.score ?? 0;
  const lastAction = runtime.lastAction || 'idle';
  const isChampion = runtime.isChampion || false;
  const stake = financial.totalStake ?? 0;
  const holders = token?.holders || 0;
  const isCommunityPowered = holders >= 25;

  const handleShare = () => {
    const text = `🔥 My AI Agent is dominating the Arena\n\nName: ${name}\nScore: ${score}\nToken Change: ${token?.priceChange.toFixed(2)}%\n\nCan you beat it?`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleMockBuy = async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: id, amount: tradeAmount })
      });
      if (!res.ok) throw new Error('Buy failed');
      const updated = await fetch(`${API_URL}/api/agents/${id}`);
      if (updated.ok) setAgent(await updated.json());
    } catch (error) {
      console.error('Buy failed:', error);
      alert('Buy failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockSell = async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/sell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: id, amount: tradeAmount })
      });
      if (!res.ok) throw new Error('Sell failed');
      const updated = await fetch(`${API_URL}/api/agents/${id}`);
      if (updated.ok) setAgent(await updated.json());
    } catch (error) {
      console.error('Sell failed:', error);
      alert('Sell failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBoost = async () => {
    if (!id) return;
    try {
      await fetch(`${API_URL}/api/agents/${id}/boost`, { method: 'POST' });
      const updated = await fetch(`${API_URL}/api/agents/${id}`);
      if (updated.ok) setAgent(await updated.json());
    } catch (error) {
      console.error('Boost failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/arena" className="text-cyan-400 hover:underline">← Back</Link>

        <div className="flex gap-2">
          {!token && <button onClick={() => navigate(`/launch/${id}`)} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500">Launch Token</button>}
          {token && <button onClick={handleShare} className="px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition">🐦 Share</button>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">{name}</h1>
            {isCommunityPowered && <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-orange-400 text-black text-xs font-bold rounded-full shadow-lg animate-pulse">🔥 Community Powered</span>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-1 bg-gray-800 rounded text-xs capitalize">{personality}</span>
            <span className="px-2 py-1 bg-gray-800 rounded text-xs capitalize">{strategy}</span>
            {token && <span className="px-2 py-1 bg-gray-800 rounded text-xs font-mono">👥 {token.holders || 0} Holders</span>}
            {isChampion && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold">🏆 CHAMPION</span>}
          </div>
          <p className="text-gray-400 mt-2 max-w-xl">{description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Token Info</h3>

          {token ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price</span>
                <span className="text-xl font-mono text-cyan-400">${token.price.toFixed(8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Cap</span>
                <span className="font-mono text-purple-400">${token.marketCap.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Circulating</span>
                <span className="font-mono text-gray-300">{token.circulatingSupply.toLocaleString()}</span>
              </div>

              <div className="pt-4 border-t border-gray-800 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={e => setTradeAmount(Number(e.target.value))}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={handleMockBuy}
                    disabled={loading}
                    className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-1 rounded text-sm hover:bg-green-500/30 disabled:opacity-50"
                  >
                    {loading ? '...' : 'Buy'}
                  </button>
                  <button
                    onClick={handleMockSell}
                    disabled={loading}
                    className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-1 rounded text-sm hover:bg-red-500/30 disabled:opacity-50"
                  >
                    {loading ? '...' : 'Sell'}
                  </button>
                </div>
              </div>

              {/* ✅ STAKING SECTION */}
              {/* ✅ STAKING SECTION - FIXED */}
              <div className="pt-4 border-t border-gray-800">
                <h4 className="text-sm font-bold text-gray-400 mb-3">💎 Stake on this Agent</h4>

                <div className="space-y-3">
                  {/* Input & Button */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => { /* call stake() from useStake */ }}
                      className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-sm hover:bg-purple-500/30 transition"
                    >
                      Stake
                    </button>
                  </div>

                  {/* Total Staked Row */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Total Staked:</span>
                    <span className="text-gray-300 font-mono">
                      {agent.financial?.totalStake?.toLocaleString() ?? 0}
                    </span>
                  </div>

                  {/* ✅ Power from Staking - SEPARATE ROW (benar!) */}
                  {agent.financial?.totalStake > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Power from Staking</span>
                      <span className="text-orange-400 font-mono">
                        🔥 +{Math.min(25, Math.log10(agent.financial.totalStake + 1) * 10).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ YOUR POSITION SECTION - NEW */}
              {connected && publicKey && (userStats.totalStaked > 0 || userStats.totalRewards > 0) && (
                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">👤 Your Position</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-800/50 p-2 rounded">
                      <span className="text-gray-500 block text-xs">Your Stake</span>
                      <span className="font-mono text-cyan-400">{userStats.totalStaked.toFixed(2)}</span>
                    </div>
                    <div className="bg-gray-800/50 p-2 rounded">
                      <span className="text-gray-500 block text-xs">Your Rewards</span>
                      <span className="font-mono text-green-400">{userStats.totalRewards.toFixed(2)}</span>
                    </div>
                  </div>
                  {userStats.unclaimedRewards > 0 && (
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                      🎁 {userStats.unclaimedRewards.toFixed(2)} unclaimed
                    </p>
                  )}
                </div>
              )}

              {runtime.history && runtime.history.length > 0 && (
                <div className="pt-4 border-t border-gray-800">
                  <h4 className="text-sm font-bold text-gray-400 mb-2">Battle History</h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {runtime.history.map((battle, i) => (
                      <div key={i} className="flex justify-between text-xs bg-gray-800/50 p-2 rounded">
                        <span className={battle.result === 'win' ? 'text-green-400' : 'text-red-400'}>{battle.result.toUpperCase()}</span>
                        <span className="text-gray-500">{battle.scoreChange >= 0 ? '+' : ''}{battle.scoreChange} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No token launched yet.</p>
              <button onClick={() => navigate(`/launch/${id}`)} className="mt-4 text-cyan-400 hover:underline">Launch now →</button>
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
            <h3 className="text-lg font-bold">Agent Stats</h3>
            <button onClick={handleBoost} className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition">⚡ Boost +10</button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-400">Score</span><span className="font-mono font-bold">{score.toFixed(0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Last Action</span><span className={`capitalize font-bold ${lastAction === 'win' ? 'text-green-400' : lastAction === 'lose' ? 'text-red-400' : 'text-yellow-400'}`}>{lastAction}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Staked</span><span className="font-mono text-purple-400">{stake.toFixed(0)}</span></div>
            <div className="pt-4 border-t border-gray-800"><p className="text-xs text-gray-500 mb-1">Agent Wallet</p><code className="block text-xs bg-gray-800 p-2 rounded break-all">{shortenWallet(agent.agentWallet)}</code></div>
            <div><p className="text-xs text-gray-500 mb-1">Owner Wallet</p><code className="block text-xs bg-gray-800 p-2 rounded break-all">{shortenWallet(agent.ownerWallet)}</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}