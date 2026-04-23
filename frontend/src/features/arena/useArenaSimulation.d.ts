import { Agent, ActionType } from '../../types';
export interface ActionLogEntry {
    id: string;
    agentName: string;
    action: ActionType;
    scoreDelta: number;
    timestamp: number;
}
export declare function useArenaSimulation(initialAgents: Agent[]): {
    agents: Agent[];
    logs: ActionLogEntry[];
};
//# sourceMappingURL=useArenaSimulation.d.ts.map