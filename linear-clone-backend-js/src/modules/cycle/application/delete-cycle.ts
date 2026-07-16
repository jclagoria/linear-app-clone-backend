import { CycleRepository } from './ports/cycle-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import {
  CycleNotFoundError,
  NotCycleTeamMemberError,
  ActiveCycleCannotBeDeletedError,
} from '../domain/errors';

export class DeleteCycle {
  constructor(
    private cycleRepository: CycleRepository,
    private teamMemberQuery: TeamMemberQuery,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const cycle = await this.cycleRepository.findById(id);
    if (!cycle) {
      throw new CycleNotFoundError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(cycle.teamId, userId);
    if (!isMember) {
      throw new NotCycleTeamMemberError();
    }

    if (cycle.status !== 'draft') {
      throw new ActiveCycleCannotBeDeletedError(
        cycle.status === 'active'
          ? 'Active cycles cannot be deleted'
          : 'Completed cycles cannot be deleted',
      );
    }

    await this.cycleRepository.delete(id);
  }
}
