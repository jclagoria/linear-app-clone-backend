import { z } from 'zod';
import { IssueRepository } from './ports/issue-repository';
import { EventPublisher } from './ports/event-publisher';
import { IssueNotFoundError, NotTeamMemberError } from '../domain/errors';

export interface TeamMemberQuery {
  isTeamMember(teamId: string, userId: string): Promise<boolean>;
}

export interface NotificationService {
  create(event: {
    type: 'issue_assigned' | 'issue_mentioned' | 'comment_added' | 'statusChanged' | 'cycle_started' | 'cycle_completed';
    actorId: string;
    targetId: string;
    metadata: Record<string, unknown>;
  }): Promise<void>;
}

export const AssignIssueInput = z.object({
  assigneeId: z.string().uuid().nullable(),
});

export type AssignIssueInputType = z.infer<typeof AssignIssueInput>;

export interface AssignIssueOutput {
  id: string;
  assigneeId: string | null;
  updatedAt: Date;
}

export class AssignIssue {
  constructor(
    private issueRepository: IssueRepository,
    private teamMemberQuery: TeamMemberQuery,
    private eventPublisher: EventPublisher,
    private notificationService?: NotificationService,
  ) {}

  async execute(
    issueId: string,
    input: AssignIssueInputType,
    userId: string,
  ): Promise<AssignIssueOutput> {
    const validated = AssignIssueInput.parse(input);

    // Check issue exists
    const existing = await this.issueRepository.findById(issueId);
    if (!existing) {
      throw new IssueNotFoundError();
    }

    // If assigning to someone, validate they are team member
    if (validated.assigneeId !== null) {
      const isMember = await this.teamMemberQuery.isTeamMember(
        existing.teamId,
        validated.assigneeId,
      );
      if (!isMember) {
        throw new NotTeamMemberError('Assignee must be a member of the issue\'s team');
      }
    }

    const updated = await this.issueRepository.update(issueId, {
      assigneeId: validated.assigneeId,
    });

    await this.eventPublisher.publish({
      type: 'IssueAssigneeChanged',
      userId,
      timestamp: new Date(),
      issueId: updated.id,
      teamId: updated.teamId,
      previousAssigneeId: existing.assigneeId,
      newAssigneeId: validated.assigneeId,
    });

    // Send notification to the newly assigned user
    if (this.notificationService && validated.assigneeId && validated.assigneeId !== existing.assigneeId) {
      await this.notificationService.create({
        type: 'issue_assigned',
        actorId: userId,
        targetId: issueId,
        metadata: {
          assigneeId: validated.assigneeId,
          issueTitle: existing.title,
          issueIdentifier: existing.identifier,
        },
      });
    }

    return {
      id: updated.id,
      assigneeId: updated.assigneeId,
      updatedAt: updated.updatedAt,
    };
  }
}
