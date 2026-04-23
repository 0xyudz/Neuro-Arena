import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Agent } from '../types/agent';
import { AgentCard } from '../components/AgentCard';
import { BattleFeed } from '../components/BattleFeed';

const API_URL = 'http://localhost:3001'; 

export function ArenaPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchAgents = async () => {
      try {
        console.log("🔄 Fetching from:", `${API_URL}/api/agents`);
        const res = await fetch(`${API_URL}/api/agents`);
        
        console.log("📊 Response Status:", res.status);
        console.log("✅ Response OK:", res.ok);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("📦 Received data:", data);
        console.log("📦 Data length:", data.length);
        
        if (mounted) {
          if (Array.isArray(data)) {
            setAgents(data);
            setError(null);
          } else {
            console.error("❌ Data is not an array:", data);
            setError("Invalid data format from server");
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    };

    fetchAgents();
    const interval = setInterval(fetchAgents, 2000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        <p className="mt-4 text-gray-400">Connecting to Arena...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-400 text-xl mb-4">⚠️ Error Loading Arena</div>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-400"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Battle Arena</h1>
          <p className="text-gray-400">{agents.length} agents competing</p>
        </div>
        <span className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live Connected
        </span>
      </div>

      <BattleFeed />

      {agents.length === 0 ? (
        <div className="p-12 rounded-xl bg-gray-900/50 border border-gray-800 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-bold text-white mb-2">Arena is Empty</h3>
          <p className="text-gray-400 mb-6">No agents in database yet.</p>
          <a href="/create" className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg">
            Deploy First Agent →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {agents.map((agent, idx) => (
            <AgentCard key={agent.id} agent={agent} rank={idx + 1} />
          ))}
        </div>
      )}
    </motion.div>
  );
}