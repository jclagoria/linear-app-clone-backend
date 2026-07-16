import { z } from 'zod';
import { CycleRepository } from './ports/cycle-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { CycleEventPublisher } from './ports/event-publisher';
import {
  EmptyCycleNameError,
  NotCycleTeamMemberError,
  CycleDateValidationError,
  CyclePastStartDateError,
} from '../domain/errors';

export const CreateCycleInput = z.object({
  teamId: z.string().uuid(),
  name: z.string().max(255),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export type CreateCycleInputType = z.infer<typeof CreateCycleInput>;

export interface CreateCycleOutput {
  id: string;
  teamId: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export class CreateCycle {
  constructor(
    private cycleRepository: CycleRepository,
    private teamMemberQuery: TeamMemberQuery,
    private eventPublisher: CycleEventPublisher,
  ) {}

  async execute(input: CreateCycleInputType, userId: string): Promise<CreateCycleOutput> {
    const validated = CreateCycleInput.parse(input);

    if (!validated.name || validated.name.trim().length === 0) {
      throw new EmptyCycleNameError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(validated.teamId, userId);
    if (!isMember) {
      throw new NotCycleTeamMemberError();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(validated.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(validated.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new CyclePastStartDateError();
    }

    if (endDate <= startDate) {
      throw new CycleDateValidationError();
    }

    const cycle = await this.cycleRepository.create({
      teamId: validated.teamId,
      name: validated.name.trim(),
      description: validated.description || null,
      status: 'draft',
      startDate: validated.startDate,
      endDate: validated.endDate,
    });

    await this.eventPublisher.publish({
      type: 'CycleCreated',
      userId,
      timestamp: new Date(),
      cycleId: cycle.id,
      teamId: cycle.teamId,
    });

    return {
      id: cycle.id,
      teamId: cycle.teamId,
      name: cycle.name,
      description: cycle.description,
      status: cycle.status as any,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      createdAt: cycle.createdAt,
      updatedAt: cycle.updatedAt,
      completedAt: cycle.completedAt,
    };
  }
}
