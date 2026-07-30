import { TeamMemberRepository } from './ports/team-member-repository';
import { TeamRepository } from './ports/team-repository';
import { OrganizationRepository } from './ports/organization-repository';

export interface ListUserTeamsOutputTeam {
  id: string;
  name: string;
  key: string;
  orgId: string;
  orgName: string;
}

export interface ListUserTeamsOutput {
  teams: ListUserTeamsOutputTeam[];
}

export class ListUserTeams {
  constructor(
    private teamMemberRepository: TeamMemberRepository,
    private teamRepository: TeamRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute(userId: string): Promise<ListUserTeamsOutput> {
    const memberships = await this.teamMemberRepository.findByUserId(userId);

    const teams = await Promise.all(
      memberships.map(async (membership) => {
        const team = await this.teamRepository.findById(membership.teamId);
        if (!team) return null;

        const org = await this.organizationRepository.findById(team.organizationId);
        if (!org) return null;

        return {
          id: team.id,
          name: team.name,
          key: team.key,
          orgId: org.id,
          orgName: org.name,
        };
      }),
    );

    return {
      teams: teams.filter((t): t is ListUserTeamsOutputTeam => t !== null),
    };
  }
}
