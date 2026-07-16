import { TeamMemberQuery } from './ports/team-member-query';
import { NotCycleTeamMemberError } from '../domain/errors';
import { CycleRepository } from './ports/cycle-repository';

export class ListCycles {
  constructor(
    private cycleRepository: CycleRepository,
    private teamMemberQuery: TeamMemberQuery,
  ) {}

  async execute(teamId: string, userId: string, status?: string, cursor?: string, limit?: number) {
    const isMember = await this.teamMemberQuery.isTeamMember(teamId, userId);
    if (!isMember) {
      throw new NotCycleTeamMemberError();
    }

    return this.cycleRepository.findByTeam(teamId, status, cursor, limit);
  }
}
