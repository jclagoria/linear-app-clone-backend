import { z } from 'zod';
import { ProjectRepository } from './ports/project-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { TeamAdminQuery } from './ports/team-admin-query';
import { IssueUpdateQuery } from './ports/issue-update-query';
import { ProjectEventPublisher } from './ports/event-publisher';
import {
  ProjectNotFoundError,
  InvalidProjectStatusTransitionError,
  NotProjectTeamMemberError,
  ProjectCancelNotAdminError,
  CannotReopenCompletedProjectError,
} from '../domain/errors';

const VALID_TRANSITIONS: Record<string, string[]> = {
  planned: ['in_progress'],
  in_progress: ['completed', 'canceled'],
  completed: [],
  canceled: [],
};

export const ChangeProjectStatusInput = z.object({
  status: z.enum(['planned', 'in_progress', 'completed', 'canceled']),
});

export type ChangeProjectStatusInputType = z.infer<typeof ChangeProjectStatusInput>;

export class ChangeProjectStatus {
  constructor(
    private projectRepository: ProjectRepository,
    private teamMemberQuery: TeamMemberQuery,
    private teamAdminQuery: TeamAdminQuery,
    private issueUpdateQuery: IssueUpdateQuery,
    private eventPublisher: ProjectEventPublisher,
  ) {}

  async execute(id: string, input: ChangeProjectStatusInputType, userId: string): Promise<any> {
    const validated = ChangeProjectStatusInput.parse(input);

    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new ProjectNotFoundError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(project.teamId, userId);
    if (!isMember) {
      throw new NotProjectTeamMemberError();
    }

    const currentStatus = project.status;
    const newStatus = validated.status;

    if (currentStatus === 'completed') {
      throw new CannotReopenCompletedProjectError();
    }

    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new InvalidProjectStatusTransitionError(
        `Cannot transition from '${currentStatus}' to '${newStatus}'`,
      );
    }

    if (newStatus === 'canceled') {
      const isAdmin = await this.teamAdminQuery.isTeamAdmin(project.teamId, userId);
      if (!isAdmin) {
        throw new ProjectCancelNotAdminError();
      }
    }

    if (newStatus === 'canceled') {
      const issues = await this.issueUpdateQuery.getIssuesByProject(id);
      for (const issue of issues) {
        await this.issueUpdateQuery.updateIssueProjectId(issue.id, null);
      }
    }

    const updated = await this.projectRepository.update(id, { status: newStatus as any });

    await this.eventPublisher.publish({
      type: 'ProjectStatusChanged',
      userId,
      timestamp: new Date(),
      projectId: id,
      teamId: updated.teamId,
      oldStatus: currentStatus,
      newStatus,
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
