import { TeamRepository } from './ports/team-repository';
import { TeamMemberRepository } from './ports/team-member-repository';
import { EventPublisher } from './ports/event-publisher';
import { TeamNotFoundError, NotTeamAdminError } from '../domain/errors';

export interface DeleteTeamInput {
  userId: string;
  teamId: string;
}

export class DeleteTeam {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: DeleteTeamInput): Promise<void> {
    const team = await this.teamRepository.findById(input.teamId);
    if (!team) {
      throw new TeamNotFoundError();
    }

    const membership = await this.teamMemberRepository.findByTeamAndUser(input.teamId, input.userId);
    if (!membership || membership.role !== 'admin') {
      throw new NotTeamAdminError();
    }

    await this.teamMemberRepository.deleteByTeamId(input.teamId);

    await this.teamRepository.delete(input.teamId);

    await this.eventPublisher.publish({
      type: 'TeamDeleted',
      userId: input.userId,
      timestamp: new Date(),
      teamId: input.teamId,
      organizationId: team.organizationId,
    });
  }
}
