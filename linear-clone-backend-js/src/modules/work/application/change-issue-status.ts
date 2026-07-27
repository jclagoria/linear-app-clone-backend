import { z } from 'zod';
import { IssueRepository } from './ports/issue-repository';
import { EventPublisher } from './ports/event-publisher';
import { WorkflowValidationService, StateHistoryService } from './ports/workflow-validation-service';
import { IssueNotFoundError, InvalidTransitionError } from '../domain/errors';

export interface NotificationService {
  create(event: {
    type: 'issue_assigned' | 'issue_mentioned' | 'comment_added' | 'statusChanged' | 'cycle_started' | 'cycle_completed';
    actorId: string;
    targetId: string;
    metadata: Record<string, unknown>;
  }): Promise<void>;
}

export type StatusType = 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled';

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
    private workflowValidation?: WorkflowValidationService,
    private stateHistoryService?: StateHistoryService,
    private notificationService?: NotificationService,
  ) {}

  async execute(
    issueId: string,
    input: ChangeIssueStatusInputType,
    userId: string,
  ): Promise<ChangeIssueStatusOutput> {
    const validated = ChangeIssueStatusInput.parse(input);

    const existing = await this.issueRepository.findById(issueId);
    if (!existing) {
      throw new IssueNotFoundError();
    }

    const currentStatus = await this.issueStatusQuery.getStatusById(existing.statusId);
    const targetStatus = await this.issueStatusQuery.getStatusById(validated.statusId);

    if (!currentStatus || !targetStatus) {
      throw new InvalidTransitionError('Status not found');
    }

    if (this.workflowValidation) {
      const validation = await this.workflowValidation.validateTransition({
        teamId: existing.teamId,
        issueId,
        toStateId: validated.statusId,
        fromStateId: existing.statusId,
      });
      if (!validation.valid) {
        throw new InvalidTransitionError(
          `Cannot transition: ${validation.reason || 'transition_not_allowed'}`,
        );
      }
    } else {
      // Fallback: basic transition validation when no workflow service is provided
      if (currentStatus.type === 'canceled') {
        throw new InvalidTransitionError('Cannot transition from canceled state');
      }

      // Define allowed transitions (unstarted -> started -> completed)
      const allowedTransitions: Record<string, string[]> = {
        unstarted: ['started', 'canceled'],
        started: ['completed', 'canceled'],
        completed: ['started', 'canceled'],
      };

      const allowed = allowedTransitions[currentStatus.type] || [];
      if (!allowed.includes(targetStatus.type)) {
        throw new InvalidTransitionError(
          `Cannot transition from ${currentStatus.type} to ${targetStatus.type}`,
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

    if (this.stateHistoryService) {
      await this.stateHistoryService.recordStatusChange({
        issueId,
        fromStateId: existing.statusId,
        toStateId: validated.statusId,
        userId,
      });
    }

    // Send notification for status change
    if (this.notificationService) {
      await this.notificationService.create({
        type: 'statusChanged',
        actorId: userId,
        targetId: issueId,
        metadata: {
          issueTitle: existing.title,
          issueIdentifier: existing.identifier,
          fromStatus: currentStatus.name,
          toStatus: targetStatus.name,
        },
      });
    }

    return {
      id: updated.id,
      statusId: updated.statusId,
      completedAt: updated.completedAt,
      canceledAt: updated.canceledAt,
      updatedAt: updated.updatedAt,
    };
  }
}
