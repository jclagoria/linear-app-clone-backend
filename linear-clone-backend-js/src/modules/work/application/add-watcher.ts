import { z } from 'zod';
import { WatcherRepository } from './ports/watcher-repository';
import { EventPublisher } from './ports/event-publisher';
import { AlreadyWatchingError } from '../domain/errors';

export interface TeamMemberQuery {
  isTeamMember(teamId: string, userId: string): Promise<boolean>;
}

export interface IssueTeamQuery {
  getIssueTeamId(issueId: string): Promise<string | null>;
}

export const AddWatcherInput = z.object({
  issueId: z.string().uuid(),
  userId: z.string().uuid().optional(),
});

export type AddWatcherInputType = z.infer<typeof AddWatcherInput>;

export class AddWatcher {
  constructor(
    private watcherRepository: WatcherRepository,
    private teamMemberQuery: TeamMemberQuery,
    private issueTeamQuery: IssueTeamQuery,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: AddWatcherInputType, authenticatedUserId: string) {
    const validated = AddWatcherInput.parse(input);
    const targetUserId = validated.userId || authenticatedUserId;

    const teamId = await this.issueTeamQuery.getIssueTeamId(validated.issueId);
    if (!teamId) {
      throw new Error('Issue not found');
    }

    const isMember = await this.teamMemberQuery.isTeamMember(teamId, targetUserId);
    if (!isMember) {
      throw new Error('User is not a member of this team');
    }

    const existing = await this.watcherRepository.findOne(validated.issueId, targetUserId);
    if (existing) {
      throw new AlreadyWatchingError();
    }

    const watcher = await this.watcherRepository.create({
      issueId: validated.issueId,
      userId: targetUserId,
    });

    await this.eventPublisher.publish({
      type: 'issue.watcher.added',
      userId: authenticatedUserId,
      timestamp: new Date(),
      issueId: validated.issueId,
      targetUserId,
    });

    return watcher;
  }
}
