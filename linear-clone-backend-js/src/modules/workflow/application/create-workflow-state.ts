import { StateRepository } from './ports/state-repository';
import { TeamAdminQuery } from './ports/team-admin-query';
import {
  DuplicateStateNameError,
  MissingUnstartedStateError,
  MissingCompletedStateError,
  MultipleCanceledStatesError,
  NotTeamAdminError,
} from '../domain/errors';
import { WorkflowStateType } from '../domain/default-workflow';

export interface CreateWorkflowStateInput {
  teamId: string;
  name: string;
  type: WorkflowStateType;
  position?: number;
  userId: string;
}

export class CreateWorkflowState {
  constructor(
    private stateRepository: StateRepository,
    private teamAdminQuery: TeamAdminQuery,
  ) {}

  async execute(input: CreateWorkflowStateInput) {
    const isAdmin = await this.teamAdminQuery.isTeamAdmin(input.teamId, input.userId);
    if (!isAdmin) throw new NotTeamAdminError();

    if (input.type === 'canceled') {
      const cancelCount = await this.stateRepository.countByTeamAndType(input.teamId, 'canceled');
      if (cancelCount >= 1) throw new MultipleCanceledStatesError();
    }

    const exists = await this.stateRepository.existsByName(input.teamId, input.name);
    if (exists) throw new DuplicateStateNameError();

    const state = await this.stateRepository.create({
      teamId: input.teamId,
      name: input.name,
      type: input.type,
      position: input.position ?? 0,
    });

    return state;
  }
}
