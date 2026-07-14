import { TeamRepository } from './ports/team-repository';
import { TeamMemberRepository } from './ports/team-member-repository';
import { TeamNotFoundError, NotTeamMemberError } from '../domain/errors';

export interface GetTeamDetailsInput {
  userId: string;
  teamId: string;
}

export class GetTeamDetails {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
  ) {}

  async execute(input: GetTeamDetailsInput) {
    const team = await this.teamRepository.findById(input.teamId);
    if (!team) {
      throw new TeamNotFoundError();
    }

    const membership = await this.teamMemberRepository.findByTeamAndUser(input.teamId, input.userId);
    if (!membership) {
      throw new NotTeamMemberError();
    }

    const members = await this.teamMemberRepository.findByTeamId(input.teamId);

    return {
      id: team.id,
      organizationId: team.organizationId,
      name: team.name,
      key: team.key,
      memberCount: members.length,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}
