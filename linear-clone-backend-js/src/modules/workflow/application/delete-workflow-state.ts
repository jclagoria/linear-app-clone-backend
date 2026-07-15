import { StateRepository } from './ports/state-repository';
import { TransitionRepository } from './ports/transition-repository';
import { TeamAdminQuery } from './ports/team-admin-query';
import {
  StateNotFoundError,
  StateInUseError,
  NotTeamAdminError,
} from '../domain/errors';

export interface DeleteWorkflowStateInput {
  teamId: string;
  stateId: string;
  userId: string;
}

export class DeleteWorkflowState {
  constructor(
    private stateRepository: StateRepository,
    private transitionRepository: TransitionRepository,
    private teamAdminQuery: TeamAdminQuery,
  ) {}

  async execute(input: DeleteWorkflowStateInput) {
    const isAdmin = await this.teamAdminQuery.isTeamAdmin(input.teamId, input.userId);
    if (!isAdmin) throw new NotTeamAdminError();

    const existing = await this.stateRepository.findById(input.stateId);
    if (!existing) throw new StateNotFoundError();

    const refCount = await this.transitionRepository.countByStateId(input.stateId);
    if (refCount > 0) throw new StateInUseError();

    await this.stateRepository.delete(input.stateId);
  }
}
