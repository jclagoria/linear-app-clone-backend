import { CycleRepository } from './ports/cycle-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { CycleNotFoundError, NotCycleTeamMemberError } from '../domain/errors';

export class GetCycle {
  constructor(
    private cycleRepository: CycleRepository,
    private teamMemberQuery: TeamMemberQuery,
  ) {}

  async execute(id: string, userId: string): Promise<any> {
    const cycle = await this.cycleRepository.findById(id);
    if (!cycle) {
      throw new CycleNotFoundError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(cycle.teamId, userId);
    if (!isMember) {
      throw new NotCycleTeamMemberError();
    }

    return {
      id: cycle.id,
      teamId: cycle.teamId,
      name: cycle.name,
      description: cycle.description,
      status: cycle.status,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      createdAt: cycle.createdAt,
      updatedAt: cycle.updatedAt,
      completedAt: cycle.completedAt,
    };
  }
}
