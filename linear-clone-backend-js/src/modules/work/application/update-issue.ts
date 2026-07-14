import { z } from 'zod';
import { IssueRepository } from './ports/issue-repository';
import { EventPublisher } from './ports/event-publisher';
import { IssueNotFoundError, TeamMismatchError, EmptyTitleError } from '../domain/errors';

export interface ProjectQuery {
  getProjectTeamId(projectId: string): Promise<string | null>;
}

export interface TeamQuery {
  getIssueTeamId(issueId: string): Promise<string | null>;
}

export const UpdateIssueInput = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(255).optional(),
  description: z.string().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  priority: z.number().int().min(0).max(4).optional(),
  cycleId: z.string().uuid().nullable().optional(),
});

export type UpdateIssueInputType = z.infer<typeof UpdateIssueInput>;

export interface UpdateIssueOutput {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  projectId: string | null;
  priority: number;
  cycleId: string | null;
  updatedAt: Date;
}

export class UpdateIssue {
  constructor(
    private issueRepository: IssueRepository,
    private projectQuery: ProjectQuery,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(
    issueId: string,
    input: UpdateIssueInputType,
    userId: string,
  ): Promise<UpdateIssueOutput> {
    const validated = UpdateIssueInput.parse(input);

    // Check title not empty if provided
    if (validated.title !== undefined && validated.title.trim().length === 0) {
      throw new EmptyTitleError();
    }

    // Check issue exists
    const existing = await this.issueRepository.findById(issueId);
    if (!existing) {
      throw new IssueNotFoundError();
    }

    // If project change, validate it belongs to same team
    if (validated.projectId !== undefined && validated.projectId !== null) {
      const projectTeamId = await this.projectQuery.getProjectTeamId(validated.projectId);
      if (!projectTeamId || projectTeamId !== existing.teamId) {
        throw new TeamMismatchError('Project must belong to the same team');
      }
    }

    const updated = await this.issueRepository.update(issueId, {
      ...(validated.title !== undefined && { title: validated.title }),
      ...(validated.description !== undefined && { description: validated.description }),
      ...(validated.projectId !== undefined && { projectId: validated.projectId }),
      ...(validated.priority !== undefined && { priority: validated.priority }),
      ...(validated.cycleId !== undefined && { cycleId: validated.cycleId }),
    });

    await this.eventPublisher.publish({
      type: 'IssueUpdated',
      userId,
      timestamp: new Date(),
      issueId: updated.id,
      teamId: updated.teamId,
    });

    return {
      id: updated.id,
      identifier: updated.identifier,
      title: updated.title,
      description: updated.description,
      projectId: updated.projectId,
      priority: updated.priority,
      cycleId: updated.cycleId,
      updatedAt: updated.updatedAt,
    };
  }
}
