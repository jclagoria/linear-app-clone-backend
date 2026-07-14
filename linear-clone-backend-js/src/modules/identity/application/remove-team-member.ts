import { TeamMemberRepository } from './ports/team-member-repository';
import { TeamRepository } from './ports/team-repository';
import { EventPublisher } from './ports/event-publisher';
import {
  TeamNotFoundError,
  NotTeamAdminError,
  TeamMemberNotFoundError,
  LastAdminRemovalError,
} from '../domain/errors';

export interface RemoveTeamMemberInput {
  userId: string;
  teamId: string;
  memberUserId: string;
}

export class RemoveTeamMember {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: RemoveTeamMemberInput): Promise<void> {
    const team = await this.teamRepository.findById(input.teamId);
    if (!team) {
      throw new TeamNotFoundError();
    }

    const adminMembership = await this.teamMemberRepository.findByTeamAndUser(
      input.teamId,
      input.userId,
    );
    if (!adminMembership || adminMembership.role !== 'admin') {
      throw new NotTeamAdminError();
    }

    const targetMembership = await this.teamMemberRepository.findByTeamAndUser(
      input.teamId,
      input.memberUserId,
    );
    if (!targetMembership) {
      throw new TeamMemberNotFoundError();
    }

    if (targetMembership.role === 'admin') {
      const adminCount = await this.teamMemberRepository.countAdminsByTeamId(input.teamId);
      if (adminCount <= 1) {
        throw new LastAdminRemovalError();
      }
    }

    await this.teamMemberRepository.deleteByTeamAndUser(input.teamId, input.memberUserId);

    await this.eventPublisher.publish({
      type: 'TeamMemberRemoved',
      userId: input.userId,
      timestamp: new Date(),
      teamId: input.teamId,
      memberUserId: input.memberUserId,
    });
  }
}
