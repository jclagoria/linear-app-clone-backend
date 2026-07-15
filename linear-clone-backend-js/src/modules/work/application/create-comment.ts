import { z } from 'zod';
import { CommentRepository } from './ports/comment-repository';
import { EventPublisher } from './ports/event-publisher';
import { EmptyBodyError } from '../domain/errors';

export interface TeamMemberQuery {
  isTeamMember(teamId: string, userId: string): Promise<boolean>;
}

export interface IssueTeamQuery {
  getIssueTeamId(issueId: string): Promise<string | null>;
}

export const CreateCommentInput = z.object({
  issueId: z.string().uuid(),
  body: z.string().min(1, 'Body is required'),
});

export type CreateCommentInputType = z.infer<typeof CreateCommentInput>;

export class CreateComment {
  constructor(
    private commentRepository: CommentRepository,
    private teamMemberQuery: TeamMemberQuery,
    private issueTeamQuery: IssueTeamQuery,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: CreateCommentInputType, userId: string) {
    const validated = CreateCommentInput.parse(input);

    if (!validated.body || validated.body.trim().length === 0) {
      throw new EmptyBodyError();
    }

    const teamId = await this.issueTeamQuery.getIssueTeamId(validated.issueId);
    if (!teamId) {
      throw new Error('Issue not found');
    }

    const isMember = await this.teamMemberQuery.isTeamMember(teamId, userId);
    if (!isMember) {
      throw new Error('User is not a member of this team');
    }

    const comment = await this.commentRepository.create({
      issueId: validated.issueId,
      userId,
      body: validated.body.trim(),
    });

    await this.eventPublisher.publish({
      type: 'comment.created',
      userId,
      timestamp: new Date(),
      commentId: comment.id,
      issueId: comment.issueId,
    });

    return comment;
  }
}
