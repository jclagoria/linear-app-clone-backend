import { z } from 'zod';
import { ProjectRepository } from './ports/project-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { ProjectEventPublisher } from './ports/event-publisher';
import { ProjectNotFoundError, EmptyProjectNameError, NotProjectTeamMemberError, ProjectDateValidationError } from '../domain/errors';

export const UpdateProjectInput = z.object({
  name: z.string().max(255).optional(),
  description: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  targetDate: z.string().nullable().optional(),
});

export type UpdateProjectInputType = z.infer<typeof UpdateProjectInput>;

export class UpdateProject {
  constructor(
    private projectRepository: ProjectRepository,
    private teamMemberQuery: TeamMemberQuery,
    private eventPublisher: ProjectEventPublisher,
  ) {}

  async execute(id: string, input: UpdateProjectInputType, userId: string): Promise<any> {
    const validated = UpdateProjectInput.parse(input);

    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(project.teamId, userId);
    if (!isMember) {
      throw new NotProjectTeamMemberError();
    }

    if (validated.name !== undefined && validated.name.trim().length === 0) {
      throw new EmptyProjectNameError();
    }

    const startDate = validated.startDate !== undefined ? (validated.startDate || null) : project.startDate;
    const targetDate = validated.targetDate !== undefined ? (validated.targetDate || null) : project.targetDate;

    if (startDate && targetDate && new Date(targetDate) <= new Date(startDate)) {
      throw new ProjectDateValidationError();
    }

    const updateData: any = {};
    if (validated.name !== undefined) updateData.name = validated.name.trim();
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.startDate !== undefined) updateData.startDate = startDate;
    if (validated.targetDate !== undefined) updateData.targetDate = targetDate;

    const updated = await this.projectRepository.update(id, updateData);

    await this.eventPublisher.publish({
      type: 'ProjectUpdated',
      userId,
      timestamp: new Date(),
      projectId: id,
      teamId: updated.teamId,
    });

    return {
      id: updated.id,
      teamId: updated.teamId,
      name: updated.name,
      description: updated.description,
      status: updated.status,
      startDate: updated.startDate || null,
      targetDate: updated.targetDate || null,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
