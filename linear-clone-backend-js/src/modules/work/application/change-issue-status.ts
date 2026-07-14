import { z } from 'zod';
import { IssueRepository } from './ports/issue-repository';
import { EventPublisher } from './ports/event-publisher';
import { IssueNotFoundError, InvalidTransitionError } from '../domain/errors';

export type StatusType = 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled';

// Default workflow transition map
// Maps current status type -> allowed target status types
const DEFAULT_WORKFLOW_TRANSITIONS: Record<StatusType, StatusType[]> = {
  backlog: ['unstarted'],
  unstarted: ['started'],
  started: ['started', 'completed'],
  completed: ['started'], // Reopen
  canceled: [], // Terminal - no transitions out
};

export const ChangeIssueStatusInput = z.object({
  statusId: z.string().uuid(),
});

export type ChangeIssueStatusInputType = z.infer<typeof ChangeIssueStatusInput>;

export interface IssueStatusQuery {
  getStatusById(statusId: string): Promise<{ id: string; type: StatusType; name: string } | null>;
}

export interface ChangeIssueStatusOutput {
  id: string;
  statusId: string;
  completedAt: Date | null;
  canceledAt: Date | null;
  updatedAt: Date;
}

export class ChangeIssueStatus {
  constructor(
    private issueRepository: IssueRepository,
    private issueStatusQuery: IssueStatusQuery,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(
    issueId: string,
    input: ChangeIssueStatusInputType,
    userId: string,
  ): Promise<ChangeIssueStatusOutput> {
    const validated = ChangeIssueStatusInput.parse(input);

    // Check issue exists
    const existing = await this.issueRepository.findById(issueId);
    if (!existing) {
      throw new IssueNotFoundError();
    }

    // Get current and target status types
    const currentStatus = await this.issueStatusQuery.getStatusById(existing.statusId);
    const targetStatus = await this.issueStatusQuery.getStatusById(validated.statusId);

    if (!currentStatus || !targetStatus) {
      throw new InvalidTransitionError('Status not found');
    }

    // Validate transition (allow cancel from any state)
    if (targetStatus.type !== 'canceled') {
      const allowedTransitions = DEFAULT_WORKFLOW_TRANSITIONS[currentStatus.type];
      if (!allowedTransitions.includes(targetStatus.type)) {
        throw new InvalidTransitionError(
          `Cannot transition from '${currentStatus.name}' to '${targetStatus.name}'`,
        );
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Set completedAt when moving to completed or canceled
    if (targetStatus.type === 'completed' || targetStatus.type === 'canceled') {
      updateData.completedAt = new Date();
    }

    // Clear completedAt when moving from completed back to started
    if (currentStatus.type === 'completed' && targetStatus.type === 'started') {
      updateData.completedAt = null;
    }

    updateData.statusId = validated.statusId;

    const updated = await this.issueRepository.update(issueId, updateData as any);

    await this.eventPublisher.publish({
      type: 'IssueStatusChanged',
      userId,
      timestamp: new Date(),
      issueId: updated.id,
      teamId: updated.teamId,
      fromStatusId: existing.statusId,
      toStatusId: validated.statusId,
    });

    return {
      id: updated.id,
      statusId: updated.statusId,
      completedAt: updated.completedAt,
      canceledAt: updated.canceledAt,
      updatedAt: updated.updatedAt,
    };
  }
}
