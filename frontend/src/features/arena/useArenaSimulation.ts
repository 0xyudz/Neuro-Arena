import { useState, useEffect, useRef, useCallback } from 'react';
import { Agent, ActionType } from '../../types';

export interface ActionLogEntry {
  id: string;
  agentName: string;
  action: ActionType;
  scoreDelta: number;
  timestamp: number;
}

export function useArenaSimulation(initialAgents: Agent[]) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [logs, setLogs] = useState<ActionLogEntry[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const logBufferRef = useRef<ActionLogEntry[]>([]);

  // Sync initial agents
  useEffect(() => {
    setAgents(initialAgents);
  }, [initialAgents]);

  // WebSocket Connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'arena_update' && data.payload?.agents) {
          const updates = data.payload.agents;
          
          // Update agents and collect logs
          setAgents(prev => {
            const updatedMap = new Map(updates.map((u: any) => [u.id, u]));
            
            updates.forEach((u: any) => {
              const entry: ActionLogEntry = {
                id: `${u.id}-${Date.now()}`,
                agentName: prev.find(a => a.id === u.id)?.name || 'Unknown',
                action: u.lastAction?.action || 'adapt',
                scoreDelta: u.lastAction?.scoreDelta || 0,
                timestamp: Date.now(),
              };
              logBufferRef.current.unshift(entry);
            });

            // Keep only last 10 logs
            if (logBufferRef.current.length > 10) {
              logBufferRef.current = logBufferRef.current.slice(0, 10);
            }
            setLogs([...logBufferRef.current]);

            return prev.map(agent => {
              const update = updatedMap.get(agent.id);
              return update ? { ...agent, ...update } : agent;
            });
          });
        }
      } catch (err) {
        console.error('WS Parse Error:', err);
      }
    };

    ws.onerror = (err) => console.error('WS Error:', err);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return { agents, logs };
}