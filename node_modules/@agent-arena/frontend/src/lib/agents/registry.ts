import { Agent } from '../../types/agent';

const STORAGE_KEY = 'agent_registry_v1';
let registry: Map<string, Agent> = new Map();
let listeners: Set<(agents: Agent[]) => void> = new Set();

function loadFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) registry = new Map(Object.entries(JSON.parse(raw)));
  } catch { registry = new Map(); }
}

function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(registry)));
    listeners.forEach(fn => fn(getAgents()));
  } catch {}
}

function getAgents(): Agent[] {
  return Array.from(registry.values()).sort((a, b) => b.runtime.score - a.runtime.score);
}

loadFromStorage();

export const AgentRegistry = {
  createAgent(input: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'runtime' | 'financial'>): Agent {
    const now = Date.now();
    const agent: Agent = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      runtime: { score: 100, lastAction: null, lastActiveAt: now, state: 'active', actionCount: 0 },
      financial: { price: 0.01, totalStake: 0, priceChange: 0, volume24h: 0 },
    };
    registry.set(agent.id, agent);
    saveToStorage();
    return agent;
  },

  // ✅ ADD THIS FUNCTION
  updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
    const existing = registry.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, updatedAt: Date.now() };
    if (updates.runtime) updated.runtime = { ...existing.runtime, ...updates.runtime };
    if (updates.financial) updated.financial = { ...existing.financial, ...updates.financial };
    if (updates.token) updated.token = { ...existing.token, ...updates.token } as any;
    
    registry.set(id, updated);
    saveToStorage();
    return updated;
  },

  getAgents,
  
  getAgentById(id: string): Agent | undefined {
    return registry.get(id);
  },

  subscribe(fn: (agents: Agent[]) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
};