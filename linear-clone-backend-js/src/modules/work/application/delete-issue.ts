import { IssueRepository } from './ports/issue-repository';
import { EventPublisher } from './ports/event-publisher';
import { IssueNotFoundError } from '../domain/errors';

export class DeleteIssue {
  constructor(
    private issueRepository: IssueRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(issueId: string, userId: string): Promise<void> {
    const existing = await this.issueRepository.findById(issueId);
    if (!existing) {
      throw new IssueNotFoundError();
    }

    await this.issueRepository.softDelete(issueId);

    await this.eventPublisher.publish({
      type: 'IssueDeleted',
      userId,
      timestamp: new Date(),
      issueId,
      teamId: existing.teamId,
    });
  }
}
