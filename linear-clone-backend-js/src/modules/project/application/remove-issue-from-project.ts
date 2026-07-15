import { z } from 'zod';
import { ProjectRepository } from './ports/project-repository';
import { IssueUpdateQuery } from './ports/issue-update-query';
import { ProjectEventPublisher } from './ports/event-publisher';
import { ProjectNotFoundError, NotProjectTeamMemberError } from '../domain/errors';

export interface IssueQuery {
  findIssueById(issueId: string): Promise<{ id: string; teamId: string; projectId: string | null } | null>;
}

export class RemoveIssueFromProject {
  constructor(
    private projectRepository: ProjectRepository,
    private issueQuery: IssueQuery,
    private issueUpdateQuery: IssueUpdateQuery,
    private eventPublisher: ProjectEventPublisher,
  ) {}

  async execute(projectId: string, issueId: string, userId: string): Promise<any> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError();
    }

    const issue = await this.issueQuery.findIssueById(issueId);
    if (!issue) {
      throw new ProjectNotFoundError('Issue not found');
    }

    if (issue.teamId !== project.teamId) {
      throw new NotProjectTeamMemberError('Issue must belong to the same team as the project');
    }

    await this.issueUpdateQuery.updateIssueProjectId(issueId, null);

    await this.eventPublisher.publish({
      type: 'IssueProjectRemoved',
      userId,
      timestamp: new Date(),
      projectId,
      issueId,
      teamId: project.teamId,
    });

    const updatedProject = await this.projectRepository.findById(projectId);

    return {
      id: updatedProject!.id,
      teamId: updatedProject!.teamId,
      name: updatedProject!.name,
      description: updatedProject!.description,
      status: updatedProject!.status,
      startDate: updatedProject!.startDate || null,
      targetDate: updatedProject!.targetDate || null,
      createdAt: updatedProject!.createdAt,
      updatedAt: updatedProject!.updatedAt,
    };
  }
}
