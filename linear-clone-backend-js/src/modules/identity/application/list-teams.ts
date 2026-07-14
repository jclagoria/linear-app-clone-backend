import { TeamRepository } from './ports/team-repository';
import { OrganizationMemberRepository } from './ports/organization-member-repository';
import { OrganizationNotFoundError, NotOrganizationMemberError } from '../domain/errors';

export interface ListTeamsInput {
  userId: string;
  organizationId: string;
}

export class ListTeams {
  constructor(
    private teamRepository: TeamRepository,
    private organizationMemberRepository: OrganizationMemberRepository,
  ) {}

  async execute(input: ListTeamsInput): Promise<{ id: string; name: string; key: string; memberCount: number; createdAt: Date; updatedAt: Date }[]> {
    const membership = await this.organizationMemberRepository.findByOrganizationAndUser(
      input.organizationId,
      input.userId,
    );
    if (!membership) {
      throw new NotOrganizationMemberError();
    }

    const teams = await this.teamRepository.findByOrganizationId(input.organizationId);

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      key: team.key,
      memberCount: 0,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }));
  }
}
