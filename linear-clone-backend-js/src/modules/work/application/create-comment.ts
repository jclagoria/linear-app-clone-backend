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

export interface NotificationService {
  create(event: {
    type: 'issue_assigned' | 'issue_mentioned' | 'comment_added' | 'statusChanged' | 'cycle_started' | 'cycle_completed';
    actorId: string;
    targetId: string;
    metadata: Record<string, unknown>;
  }): Promise<void>;
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
    private notificationService?: NotificationService,
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

    // Send notifications
    if (this.notificationService) {
      // Parse @mentions from comment body
      const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
      const mentions: string[] = [];
      let match;
      while ((match = mentionRegex.exec(validated.body)) !== null) {
        mentions.push(match[1]);
      }

      // Create mention notification for each mentioned user
      if (mentions.length > 0) {
        await this.notificationService.create({
          type: 'issue_mentioned',
          actorId: userId,
          targetId: validated.issueId,
          metadata: {
            commentSnippet: validated.body.substring(0, 200),
            mentionedUsers: mentions,
            issueId: validated.issueId,
          },
        });
      }

      // Create comment_added notification for watchers
      await this.notificationService.create({
        type: 'comment_added',
        actorId: userId,
        targetId: validated.issueId,
        metadata: {
          commentSnippet: validated.body.substring(0, 200),
          issueId: validated.issueId,
        },
      });
    }

    return comment;
  }
}
