import { AgentLogEntry } from '../../types/agent';
const MAX_LOGS = 20;
const LOGS_KEY = 'agent_logs_v1';
let logs = [];
let listeners = new Set();
function loadFromStorage() {
    try {
        const stored = localStorage.getItem(LOGS_KEY);
        if (stored)
            logs = JSON.parse(stored);
    }
    catch {
        logs = [];
    }
}
function saveToStorage() {
    try {
        localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(-MAX_LOGS)));
        notify();
    }
    catch { }
}
// ✅ MOVE get BEFORE notify
function get(limit = MAX_LOGS) {
    return logs.slice(0, limit);
}
function notify() {
    listeners.forEach(fn => fn(get()));
}
loadFromStorage();
export const AgentLog = {
    add(entry) {
        const newEntry = { ...entry, id: crypto.randomUUID() };
        logs.unshift(newEntry);
        if (logs.length > MAX_LOGS)
            logs = logs.slice(0, MAX_LOGS);
        saveToStorage();
        return newEntry;
    },
    get,
    getAll() {
        return [...logs];
    },
    getByAgent(agentId, limit = 10) {
        return logs.filter(l => l.agentId === agentId).slice(0, limit);
    },
    subscribe(callback) {
        listeners.add(callback);
        callback(get());
        return () => listeners.delete(callback);
    },
    clear() {
        logs = [];
        saveToStorage();
    },
    count() {
        return logs.length;
    },
};
//# sourceMappingURL=log.js.map