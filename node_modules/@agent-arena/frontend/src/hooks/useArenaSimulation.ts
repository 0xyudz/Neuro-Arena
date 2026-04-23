// frontend/src/hooks/useArenaSimulation.ts
import { useState, useEffect, useRef } from 'react';
import { Agent } from '../types';

const WS_URL = 'ws://localhost:3001'; // Backend WebSocket port

export function useArenaSimulation() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial agents from API
  const fetchAgents = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/agents');
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    fetchAgents();
    
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🔌 WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle agent updates from backend engine
        if (message.type === 'agent_updates' && message.payload?.updates) {
          setAgents(prev => {
            const updates = message.payload.updates;
            const agentMap = new Map(prev.map(a => [a.id, a]));
            
            updates.forEach((u: any) => {
              const existing = agentMap.get(u.id);
              if (existing) {
                agentMap.set(u.id, {
                  ...existing,
                  score: u.score,
                  tokenPrice: u.tokenPrice,
                  priceChange: u.priceChange,
                  lastAction: {
                    action: u.lastAction,
                    scoreDelta: 0,
                    timestamp: new Date(u.timestamp).toISOString(),
                  },
                });
              }
            });
            
            return Array.from(agentMap.values());
          });
        }
      } catch (err) {
        console.error('WS message error:', err);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setConnected(false);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    // Re-fetch agents every 10s as fallback
    const interval = setInterval(fetchAgents, 10000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, []);

  return { agents, connected, refetch: fetchAgents };
}