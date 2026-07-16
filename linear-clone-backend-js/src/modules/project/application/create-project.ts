import { z } from 'zod';
import { ProjectRepository } from './ports/project-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { ProjectEventPublisher } from './ports/event-publisher';
import { EmptyProjectNameError, NotProjectTeamMemberError, ProjectDateValidationError } from '../domain/errors';

export const CreateProjectInput = z.object({
  teamId: z.string().uuid(),
  name: z.string().max(255),
  description: z.string().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
});

export type CreateProjectInputType = z.infer<typeof CreateProjectInput>;

export interface CreateProjectOutput {
  id: string;
  teamId: string;
  name: string;
  description: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  startDate: string | null;
  targetDate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateProject {
  constructor(
    private projectRepository: ProjectRepository,
    private teamMemberQuery: TeamMemberQuery,
    private eventPublisher: ProjectEventPublisher,
  ) {}

  async execute(input: CreateProjectInputType, userId: string): Promise<CreateProjectOutput> {
    const validated = CreateProjectInput.parse(input);

    if (!validated.name || validated.name.trim().length === 0) {
      throw new EmptyProjectNameError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(validated.teamId, userId);
    if (!isMember) {
      throw new NotProjectTeamMemberError();
    }

    if (validated.startDate && validated.targetDate) {
      if (new Date(validated.targetDate) <= new Date(validated.startDate)) {
        throw new ProjectDateValidationError();
      }
    }

    const project = await this.projectRepository.create({
      teamId: validated.teamId,
      name: validated.name.trim(),
      description: validated.description || null,
      status: 'planned',
      startDate: validated.startDate || null,
      targetDate: validated.targetDate || null,
    });

    await this.eventPublisher.publish({
      type: 'ProjectCreated',
      userId,
      timestamp: new Date(),
      projectId: project.id,
      teamId: project.teamId,
    });

    return {
      id: project.id,
      teamId: project.teamId,
      name: project.name,
      description: project.description,
      status: project.status as any,
      startDate: project.startDate || null,
      targetDate: project.targetDate || null,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
