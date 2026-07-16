import { ProjectRepository } from './ports/project-repository';
import { TeamMemberQuery } from './ports/team-member-query';
import { IssueQuery } from './ports/issue-query';
import { ProjectNotFoundError, NotProjectTeamMemberError } from '../domain/errors';

export interface GetProjectProgressOutput {
  projectId: string;
  totalIssues: number;
  completedIssues: number;
  progress: number;
}

export class GetProjectProgress {
  constructor(
    private projectRepository: ProjectRepository,
    private teamMemberQuery: TeamMemberQuery,
    private issueQuery: IssueQuery,
  ) {}

  async execute(projectId: string, userId: string): Promise<GetProjectProgressOutput> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError();
    }

    const isMember = await this.teamMemberQuery.isTeamMember(project.teamId, userId);
    if (!isMember) {
      throw new NotProjectTeamMemberError();
    }

    const totalIssues = await this.issueQuery.countProjectIssues(projectId);
    const completedIssues = await this.issueQuery.countCompletedProjectIssues(projectId);

    const progress = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

    return {
      projectId,
      totalIssues,
      completedIssues,
      progress,
    };
  }
}
