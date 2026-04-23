import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Agent, ServiceEndpoint } from '../types/agent';
import { shortenWallet } from '../lib/agents/wallet';

interface Props {
  agent: Agent;
  rank?: number;
  compact?: boolean;
}

// ✅ NEW: AI Personality Helper
function getAgentPersonality(agent: any): string {
  const strategy = agent.strategy || 'balanced';
  const confidence = agent.runtime?.confidence ?? agent.confidence ?? 0.5;
  const winStreak = agent.runtime?.winStreak ?? agent.winStreak ?? 0;
  const loseStreak = agent.runtime?.loseStreak ?? agent.loseStreak ?? 0;

  if (strategy === 'aggressive' && confidence > 0.7 && winStreak >= 2) return 'Alpha Predator';
  if (strategy === 'defensive' && confidence < 0.4) return 'Cautious Survivor';
  if (loseStreak >= 3) return 'Underdog Fighter';
  if (winStreak >= 3) return 'Rising Champion';
  if (strategy === 'balanced') return 'Adaptive Strategist';
  if (strategy === 'aggressive') return 'Bold Attacker';
  if (strategy === 'defensive') return 'Steady Defender';
  return 'Emerging Agent';
}

export function AgentCard({ agent, rank, compact = false }: Props) {
  const [flash, setFlash] = useState<'win' | 'lose' | null>(null);
  const isTop = rank === 1;
  
  const metadata = agent.metadata || (agent as any);
  const name = metadata?.name || `Agent ${agent.id?.slice(0, 4)}`;
  const services: ServiceEndpoint[] = metadata?.services || [];
  const wallet = agent.agentWallet || '';
  const score = agent.runtime?.score || 0;
  const lastAction = agent.runtime?.lastAction;
  const isChampion = agent.runtime?.isChampion;
  
  // ✅ NEW: AI State
  const strategy = agent.strategy || metadata?.strategy || 'balanced';
  const recentTrend = agent.recentTrend || 'stable';
  const personality = getAgentPersonality(agent);
  
  const token = agent.token;
  const holders = token?.holders || 0;
  const isCommunityPowered = holders >= 25;
  const price = token?.price ?? 0;
  const marketCap = token?.marketCap ?? 0;
  const priceChange = token?.priceChange ?? 0;

  useEffect(() => {
    if (lastAction === 'win' || lastAction === 'lose') {
      setFlash(lastAction);
      const t = setTimeout(() => setFlash(null), 1500);
      return () => clearTimeout(t);
    }
  }, [lastAction]);

  const flashClass = flash === 'win' ? 'ring-2 ring-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                   : flash === 'lose' ? 'ring-2 ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                   : isChampion ? 'ring-2 ring-yellow-500/50' : '';

  // ✅ NEW: Trend color
  const trendColor = recentTrend === 'hot' ? 'text-red-400' : 
                     recentTrend === 'cold' ? 'text-blue-400' : 'text-gray-400';
  
  // ✅ NEW: Strategy badge color
  const strategyColor = strategy === 'aggressive' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        strategy === 'defensive' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-purple-500/20 text-purple-400 border-purple-500/30';

  if (compact) {
    return (
      <Link to={`/agent/${agent.id}`} className="block group">
        <div className={`flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition relative ${flashClass}`}>
          {isChampion && <span className="absolute -top-2 -right-2 text-lg animate-bounce">🏆</span>}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold relative ${isTop ? 'bg-yellow-500 text-black' : 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white'}`}>
              {isTop ? '👑' : name[0]}
              {lastAction === 'win' && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[8px] flex items-center justify-center font-bold">✓</span>}
              {lastAction === 'lose' && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-bold">✗</span>}
            </div>
            <div>
              <p className="font-medium text-sm truncate max-w-[100px] group-hover:text-cyan-400 transition">{name}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">{shortenWallet(wallet)}</p>
                {token && <span className={`text-[10px] font-mono ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>}
              </div>
              {/* ✅ NEW: Compact mode - Strategy badge */}
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-[9px] px-1 py-0.5 rounded border ${strategyColor} capitalize`}>
                  {strategy}
                </span>
                {recentTrend !== 'stable' && (
                  <span className={`text-[9px] ${trendColor}`}>●</span>
                )}
              </div>
            </div>
          </div>
          {token && (
            <div className="text-right hidden sm:block">
              <p className="text-gray-500 text-xs">Holders</p>
              <p className="text-sm font-mono text-orange-400">👥 {holders}</p>
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className={`p-5 rounded-xl border transition-all relative bg-gray-900 border-gray-800 ${flashClass} ${isChampion ? 'bg-yellow-500/5' : ''}`}>
      {isChampion && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full shadow-lg">🏆 CHAMPION</div>}
      
      <div className="flex items-start justify-between mb-4 pt-2">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold relative ${isTop ? 'bg-yellow-500 text-black' : 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white'}`}>
            {isTop ? '👑' : score.toFixed(0)}
            {lastAction === 'win' && <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-green-500 rounded text-[10px] font-bold text-white shadow-sm">WIN</span>}
            {lastAction === 'lose' && <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-red-500 rounded text-[10px] font-bold text-white shadow-sm">LOSE</span>}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{name}</h3>
              {isCommunityPowered && <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-orange-400 text-black rounded font-bold animate-pulse">🔥 VIRAL</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {/* ✅ UPDATED: Strategy badge with border */}
              <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize font-medium ${strategyColor}`}>
                {strategy}
              </span>
              {/* ✅ NEW: AI Personality label */}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                {personality}
              </span>
              {/* ✅ NEW: Trend indicator */}
              {recentTrend !== 'stable' && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  recentTrend === 'hot' ? 'bg-red-900/30 text-red-400 border border-red-500/30' :
                  'bg-blue-900/30 text-blue-400 border border-blue-500/30'
                }`}>
                  {recentTrend === 'hot' ? '🔥 HOT' : '❄️ COLD'}
                </span>
              )}
              {services.map((s, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/50 border border-purple-500/30 text-purple-300 uppercase font-bold">{s.name}</span>)}
              {token && <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${priceChange >= 0 ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>{token.symbol} {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%</span>}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-sm mb-4">
        <div className="bg-gray-800/50 p-2 rounded-lg"><span className="text-gray-500 block text-xs">Price</span><span className={`font-mono ${token ? 'text-cyan-400' : 'text-gray-600'}`}>{token ? `$${price.toFixed(6)}` : '-'}</span></div>
        <div className="bg-gray-800/50 p-2 rounded-lg"><span className="text-gray-500 block text-xs">MCap</span><span className={`font-mono ${token ? 'text-purple-400' : 'text-gray-600'}`}>{token ? `$${(marketCap/1000).toFixed(1)}k` : '-'}</span></div>
        <div className="bg-gray-800/50 p-2 rounded-lg"><span className="text-gray-500 block text-xs">Holders</span><span className="font-mono text-orange-400">👥 {holders}</span></div>
      </div>
      
      <Link to={`/agent/${agent.id}`} className="block text-center py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition">{token ? 'Trade / View' : 'Launch Token'}</Link>
    </div>
  );
}