import { TeamMemberRepository } from './ports/team-member-repository';
import { TeamRepository } from './ports/team-repository';
import { UserProfileRepository } from './ports/user-profile-repository';
import { TeamNotFoundError, NotTeamMemberError } from '../domain/errors';

export interface ListTeamMembersInput {
  userId: string;
  teamId: string;
}

export class ListTeamMembers {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
    private userProfileRepository: UserProfileRepository,
  ) {}

  async execute(input: ListTeamMembersInput) {
    const team = await this.teamRepository.findById(input.teamId);
    if (!team) {
      throw new TeamNotFoundError();
    }

    const requestorMembership = await this.teamMemberRepository.findByTeamAndUser(
      input.teamId,
      input.userId,
    );
    if (!requestorMembership) {
      throw new NotTeamMemberError();
    }

    const members = await this.teamMemberRepository.findByTeamId(input.teamId);

    const enriched = await Promise.all(
      members.map(async (member) => {
        const user = await this.userProfileRepository.findById(member.userId);
        return {
          id: member.id,
          userId: member.userId,
          name: user?.name ?? 'Unknown',
          email: user?.email ?? '',
          role: member.role,
          joinedAt: member.createdAt,
        };
      }),
    );

    return enriched;
  }
}
