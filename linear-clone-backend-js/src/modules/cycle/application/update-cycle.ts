import { z } from 'zod';
import { CycleRepository } from './ports/cycle-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { CycleEventPublisher } from './ports/event-publisher';
import {
  CycleNotFoundError,
  EmptyCycleNameError,
  NotCycleTeamMemberError,
  CycleDateValidationError,
} from '../domain/errors';

export const UpdateCycleInput = z.object({
  name: z.string().max(255).optional(),
  description: z.string().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type UpdateCycleInputType = z.infer<typeof UpdateCycleInput>;

export class UpdateCycle {
  constructor(
    private cycleRepository: CycleRepository,
    private teamMemberQuery: TeamMemberQuery,
    private eventPublisher: CycleEventPublisher,
  ) {}

  async execute(id: string, input: UpdateCycleInputType, userId: string): Promise<any> {
    const validated = UpdateCycleInput.parse(input);

    const cycle = await this.cycleRepository.findById(id);
    if (!cycle) {
      throw new CycleNotFoundError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(cycle.teamId, userId);
    if (!isMember) {
      throw new NotCycleTeamMemberError();
    }

    if (validated.name !== undefined && validated.name.trim().length === 0) {
      throw new EmptyCycleNameError();
    }

    if ((validated.startDate !== undefined || validated.endDate !== undefined) && cycle.status !== 'draft') {
      throw new CycleDateValidationError('Dates can only be modified in Draft status');
    }

    const startDate = validated.startDate !== undefined ? validated.startDate : cycle.startDate;
    const endDate = validated.endDate !== undefined ? validated.endDate : cycle.endDate;

    if (new Date(endDate) <= new Date(startDate)) {
      throw new CycleDateValidationError();
    }

    const updateData: any = {};
    if (validated.name !== undefined) updateData.name = validated.name.trim();
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.startDate !== undefined) updateData.startDate = validated.startDate;
    if (validated.endDate !== undefined) updateData.endDate = validated.endDate;

    const updated = await this.cycleRepository.update(id, updateData);

    await this.eventPublisher.publish({
      type: 'CycleUpdated',
      userId,
      timestamp: new Date(),
      cycleId: id,
      teamId: updated.teamId,
    });

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
