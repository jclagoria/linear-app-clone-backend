import { z } from 'zod';
import { TeamRepository } from './ports/team-repository';
import { TeamMemberRepository } from './ports/team-member-repository';
import { OrganizationMemberRepository } from './ports/organization-member-repository';
import { EventPublisher } from './ports/event-publisher';
import {
  OrganizationNotFoundError,
  NotOrganizationMemberError,
  TeamKeyConflictError,
} from '../domain/errors';

export const CreateTeamInput = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  key: z
    .string()
    .min(1, 'Key is required')
    .max(10, 'Key must be 10 characters or less')
    .regex(/^[A-Z]+$/, 'Key must be uppercase letters only'),
});

export type CreateTeamInputType = z.infer<typeof CreateTeamInput>;

export interface CreateTeamOutput {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateTeam {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
    private organizationMemberRepository: OrganizationMemberRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: CreateTeamInputType): Promise<CreateTeamOutput> {
    const validatedInput = CreateTeamInput.parse(input);

    const membership = await this.organizationMemberRepository.findByOrganizationAndUser(
      validatedInput.organizationId,
      validatedInput.userId,
    );
    if (!membership) {
      throw new NotOrganizationMemberError();
    }

    const existingTeam = await this.teamRepository.findByKey(
      validatedInput.organizationId,
      validatedInput.key,
    );
    if (existingTeam) {
      throw new TeamKeyConflictError();
    }

    const team = await this.teamRepository.create({
      organizationId: validatedInput.organizationId,
      name: validatedInput.name,
      key: validatedInput.key,
    });

    await this.teamMemberRepository.create({
      teamId: team.id,
      userId: validatedInput.userId,
      role: 'admin',
    });

    await this.eventPublisher.publish({
      type: 'TeamCreated',
      userId: validatedInput.userId,
      timestamp: new Date(),
      teamId: team.id,
      organizationId: team.organizationId,
    });

    return {
      id: team.id,
      organizationId: team.organizationId,
      name: team.name,
      key: team.key,
      memberCount: 1,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }
}
