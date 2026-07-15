import { WorkflowState } from '../../domain/workflow-state';

export interface StateRepository {
  findByTeam(teamId: string): Promise<WorkflowState[]>;
  findById(id: string): Promise<WorkflowState | null>;
  create(data: { teamId: string; name: string; type: 'unstarted' | 'in_progress' | 'completed' | 'canceled'; position?: number }): Promise<WorkflowState>;
  update(id: string, data: { name?: string; type?: 'unstarted' | 'in_progress' | 'completed' | 'canceled'; position?: number }): Promise<WorkflowState>;
  delete(id: string): Promise<void>;
  existsByName(teamId: string, name: string): Promise<boolean>;
  countByTeamAndType(teamId: string, type: string): Promise<number>;
  hasCustomStates(teamId: string): Promise<boolean>;
}
