import { TransitionRepository } from './ports/transition-repository';
import { TeamAdminQuery } from './ports/team-admin-query';
import {
  TransitionNotFoundError,
  NotTeamAdminError,
} from '../domain/errors';

export interface DeleteTransitionInput {
  teamId: string;
  transitionId: string;
  userId: string;
}

export class DeleteTransition {
  constructor(
    private transitionRepository: TransitionRepository,
    private teamAdminQuery: TeamAdminQuery,
  ) {}

  async execute(input: DeleteTransitionInput) {
    const isAdmin = await this.teamAdminQuery.isTeamAdmin(input.teamId, input.userId);
    if (!isAdmin) throw new NotTeamAdminError();

    const existing = await this.transitionRepository.findById(input.transitionId);
    if (!existing) throw new TransitionNotFoundError();

    await this.transitionRepository.delete(input.transitionId);
  }
}
