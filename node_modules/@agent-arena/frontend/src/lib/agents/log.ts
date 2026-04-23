import { AgentLogEntry } from '../../types/agent';

const MAX_LOGS = 20;
const LOGS_KEY = 'agent_logs_v1';
let logs: AgentLogEntry[] = [];
let listeners: Set<(entries: AgentLogEntry[]) => void> = new Set();

function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    if (stored) logs = JSON.parse(stored);
  } catch { logs = []; }
}

function saveToStorage(): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(-MAX_LOGS)));
    notify();
  } catch {}
}

// ✅ MOVE get BEFORE notify
function get(limit = MAX_LOGS): AgentLogEntry[] {
  return logs.slice(0, limit);
}

function notify(): void {
  listeners.forEach(fn => fn(get()));
}

loadFromStorage();

export const AgentLog = {
  add(entry: Omit<AgentLogEntry, 'id'>): AgentLogEntry {
    const newEntry: AgentLogEntry = { ...entry, id: crypto.randomUUID() };
    logs.unshift(newEntry);
    if (logs.length > MAX_LOGS) logs = logs.slice(0, MAX_LOGS);
    saveToStorage();
    return newEntry;
  },

  get,

  getAll(): AgentLogEntry[] {
    return [...logs];
  },

  getByAgent(agentId: string, limit = 10): AgentLogEntry[] {
    return logs.filter(l => l.agentId === agentId).slice(0, limit);
  },

  subscribe(callback: (entries: AgentLogEntry[]) => void): () => void {
    listeners.add(callback);
    callback(get());
    return () => listeners.delete(callback);
  },

  clear(): void {
    logs = [];
    saveToStorage();
  },

  count(): number {
    return logs.length;
  },
};