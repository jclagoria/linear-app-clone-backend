import { z } from 'zod';
import { IssueRepository } from './ports/issue-repository';
import { EventPublisher } from './ports/event-publisher';
import { TeamMismatchError, NotTeamMemberError, EmptyTitleError } from '../domain/errors';

// External port needed for team membership validation
export interface TeamMemberQuery {
  isTeamMember(teamId: string, userId: string): Promise<boolean>;
}

// External port needed for project-team validation
export interface ProjectQuery {
  getProjectTeamId(projectId: string): Promise<string | null>;
}

// External port for team key lookup (identifier generation)
export interface TeamKeyQuery {
  getTeamKey(teamId: string): Promise<string | null>;
}

export const CreateIssueInput = z.object({
  title: z.string().max(255, 'Title must be 255 characters or less'),
  description: z.string().optional(),
  teamId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  priority: z.number().int().min(0).max(4).default(0),
  labelIds: z.array(z.string().uuid()).optional(),
  parentId: z.string().uuid().optional(),
  cycleId: z.string().uuid().optional(),
});

export type CreateIssueInputType = z.infer<typeof CreateIssueInput>;

export interface CreateIssueOutput {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  teamId: string;
  projectId: string | null;
  assigneeId: string | null;
  priority: number;
  statusId: string;
  parentId: string | null;
  cycleId: string | null;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateIssue {
  constructor(
    private issueRepository: IssueRepository,
    private teamMemberQuery: TeamMemberQuery,
    private projectQuery: ProjectQuery,
    private teamKeyQuery: TeamKeyQuery,
    private defaultStatusId: string,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: CreateIssueInputType, userId: string): Promise<CreateIssueOutput> {
    const validated = CreateIssueInput.parse(input);

    if (!validated.title || validated.title.trim().length === 0) {
      throw new EmptyTitleError();
    }

    // Validate user is a member of the team
    const isMember = await this.teamMemberQuery.isTeamMember(validated.teamId, userId);
    if (!isMember) {
      throw new NotTeamMemberError();
    }

    // If parent is provided, validate it belongs to same team
    if (validated.parentId) {
      const parent = await this.issueRepository.findById(validated.parentId);
      if (!parent || parent.teamId !== validated.teamId) {
        throw new TeamMismatchError('Parent issue must belong to the same team');
      }
    }

    // If project is provided, validate it belongs to same team
    if (validated.projectId) {
      const projectTeamId = await this.projectQuery.getProjectTeamId(validated.projectId);
      if (!projectTeamId || projectTeamId !== validated.teamId) {
        throw new TeamMismatchError('Project must belong to the same team');
      }
    }

    // If assignee is provided, validate they are a team member
    if (validated.assigneeId) {
      const isAssigneeMember = await this.teamMemberQuery.isTeamMember(
        validated.teamId,
        validated.assigneeId,
      );
      if (!isAssigneeMember) {
        throw new NotTeamMemberError('Assignee must be a member of the issue\'s team');
      }
    }

    // Get team key for identifier generation
    const teamKey = await this.teamKeyQuery.getTeamKey(validated.teamId);
    if (!teamKey) {
      throw new Error('Team not found');
    }

    // Get next sequence number for the team
    const sequence = await this.issueRepository.getNextSequence(validated.teamId);

    const issue = await this.issueRepository.create({
      identifier: `${teamKey}-${sequence}`,
      title: validated.title,
      description: validated.description || null,
      teamId: validated.teamId,
      projectId: validated.projectId || null,
      assigneeId: validated.assigneeId || null,
      priority: validated.priority,
      statusId: this.defaultStatusId,
      parentId: validated.parentId || null,
      cycleId: validated.cycleId || null,
      sortOrder: 0,
      sequence,
    });

    await this.eventPublisher.publish({
      type: 'IssueCreated',
      userId,
      timestamp: new Date(),
      issueId: issue.id,
      teamId: issue.teamId,
    });

    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description,
      teamId: issue.teamId,
      projectId: issue.projectId,
      assigneeId: issue.assigneeId,
      priority: issue.priority,
      statusId: issue.statusId,
      parentId: issue.parentId,
      cycleId: issue.cycleId,
      sequence: issue.sequence,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    };
  }
}
