import { StateRepository } from './ports/state-repository';
import { TeamAdminQuery } from './ports/team-admin-query';
import {
  StateNotFoundError,
  DuplicateStateNameError,
  MultipleCanceledStatesError,
  NotTeamAdminError,
} from '../domain/errors';
import { WorkflowStateType } from '../domain/default-workflow';

export interface UpdateWorkflowStateInput {
  teamId: string;
  stateId: string;
  name?: string;
  type?: WorkflowStateType;
  position?: number;
  userId: string;
}

export class UpdateWorkflowState {
  constructor(
    private stateRepository: StateRepository,
    private teamAdminQuery: TeamAdminQuery,
  ) {}

  async execute(input: UpdateWorkflowStateInput) {
    const isAdmin = await this.teamAdminQuery.isTeamAdmin(input.teamId, input.userId);
    if (!isAdmin) throw new NotTeamAdminError();

    const existing = await this.stateRepository.findById(input.stateId);
    if (!existing) throw new StateNotFoundError();

    if (input.name && input.name !== existing.name) {
      const exists = await this.stateRepository.existsByName(input.teamId, input.name);
      if (exists) throw new DuplicateStateNameError();
    }

    if (input.type === 'canceled' && input.type !== existing.type) {
      const cancelCount = await this.stateRepository.countByTeamAndType(input.teamId, 'canceled');
      if (cancelCount >= 1) throw new MultipleCanceledStatesError();
    }

    const updated = await this.stateRepository.update(input.stateId, {
      name: input.name,
      type: input.type,
      position: input.position,
    });

    return updated;
  }
}
