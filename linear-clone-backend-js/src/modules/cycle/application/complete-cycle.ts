import { CycleRepository } from './ports/cycle-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { CycleEventPublisher } from './ports/event-publisher';
import {
  CycleNotFoundError,
  NotCycleTeamMemberError,
  DraftCycleCannotBeCompletedError,
} from '../domain/errors';

export interface NotificationService {
  create(event: {
    type: 'cycle_started' | 'cycle_completed';
    actorId: string;
    targetId: string;
    metadata: Record<string, unknown>;
  }): Promise<void>;
}

export class CompleteCycle {
  constructor(
    private cycleRepository: CycleRepository,
    private teamMemberQuery: TeamMemberQuery,
    private eventPublisher: CycleEventPublisher,
    private notificationService?: NotificationService,
  ) {}

  async execute(id: string, userId: string): Promise<any> {
    const cycle = await this.cycleRepository.findById(id);
    if (!cycle) {
      throw new CycleNotFoundError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(cycle.teamId, userId);
    if (!isMember) {
      throw new NotCycleTeamMemberError();
    }

    if (cycle.status === 'draft') {
      throw new DraftCycleCannotBeCompletedError();
    }

    if (cycle.status === 'completed') {
      throw new DraftCycleCannotBeCompletedError('Cycle is already completed');
    }

    const updated = await this.cycleRepository.update(id, {
      status: 'completed' as any,
      completedAt: new Date(),
    });

    await this.eventPublisher.publish({
      type: 'CycleCompleted',
      userId,
      timestamp: new Date(),
      cycleId: id,
      teamId: cycle.teamId,
    });

    // Send cycle_completed notification
    if (this.notificationService) {
      await this.notificationService.create({
        type: 'cycle_completed',
        actorId: userId,
        targetId: id,
        metadata: {
          cycleName: cycle.name,
          teamId: cycle.teamId,
        },
      });
    }

    return {
      id: updated.id,
      teamId: updated.teamId,
      name: updated.name,
      description: updated.description,
      status: updated.status,
      startDate: updated.startDate,
      endDate: updated.endDate,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      completedAt: updated.completedAt,
    };
  }
}
