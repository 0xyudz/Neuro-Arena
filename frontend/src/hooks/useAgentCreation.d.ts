import { CreateAgentInput, Agent } from '../types';
export declare function useAgentCreation(): {
    createAgent: (input: CreateAgentInput, owner: string) => Promise<Agent | null>;
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=useAgentCreation.d.ts.map