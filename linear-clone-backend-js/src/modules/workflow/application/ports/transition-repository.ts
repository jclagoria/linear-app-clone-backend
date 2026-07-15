import { WorkflowTransition } from '../../domain/workflow-transition';

export interface TransitionRepository {
  findByTeam(teamId: string, fromStateId?: string): Promise<WorkflowTransition[]>;
  findById(id: string): Promise<WorkflowTransition | null>;
  create(data: { fromStateId: string; toStateId: string }): Promise<WorkflowTransition>;
  delete(id: string): Promise<void>;
  existsByFromAndTo(fromStateId: string, toStateId: string): Promise<boolean>;
  countByStateId(stateId: string): Promise<number>;
}
