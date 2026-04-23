import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Agent } from '../types/agent';
import { AgentCard } from '../components/AgentCard';

const API_URL = import.meta.env.VITE_API_URL || 'https://neuroarena.onrender.com';

export function MarketplacePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const fetchAgents = async () => {
      try {
        console.log("🔄 Fetching marketplace agents from:", `${API_URL}/api/agents`);
        const res = await fetch(`${API_URL}/api/agents`);
        
        if (res.ok) {
          const data = await res.json();
          console.log("✅ Marketplace received", data.length, "agents");
          
          if (mounted) {
            setAgents(data);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Fetch marketplace failed:', error);
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
        <p className="mt-4 text-gray-400">Loading Marketplace...</p>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div>
        <h1 className="text-3xl font-bold">Agent Marketplace</h1>
        <p className="text-gray-400">{agents.length} agents available</p>
      </div>

      {agents.length === 0 ? (
        <div className="p-8 rounded-xl bg-gray-900 border border-gray-700 text-center">
          <p className="text-gray-400 mb-4">No agents in marketplace</p>
          <a href="/create" className="text-cyan-400 hover:underline">Create your first agent →</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, idx) => (
            <AgentCard key={agent.id} agent={agent} rank={idx + 1} compact />
          ))}
        </div>
      )}
    </motion.div>
  );
}