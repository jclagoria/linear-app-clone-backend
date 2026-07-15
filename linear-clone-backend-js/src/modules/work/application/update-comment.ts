import { z } from 'zod';
import { CommentRepository } from './ports/comment-repository';
import { EventPublisher } from './ports/event-publisher';
import { CommentNotFoundError, CommentNotOwnedByUserError, EmptyBodyError } from '../domain/errors';

export const UpdateCommentInput = z.object({
  body: z.string().min(1, 'Body is required'),
});

export type UpdateCommentInputType = z.infer<typeof UpdateCommentInput>;

export class UpdateComment {
  constructor(
    private commentRepository: CommentRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(commentId: string, input: UpdateCommentInputType, userId: string) {
    const validated = UpdateCommentInput.parse(input);

    if (!validated.body || validated.body.trim().length === 0) {
      throw new EmptyBodyError();
    }

    const existing = await this.commentRepository.findById(commentId);
    if (!existing) {
      throw new CommentNotFoundError();
    }

    if (existing.userId !== userId) {
      throw new CommentNotOwnedByUserError();
    }

    const updated = await this.commentRepository.update(commentId, { body: validated.body.trim() });

    await this.eventPublisher.publish({
      type: 'comment.updated',
      userId,
      timestamp: new Date(),
      commentId: updated.id,
      issueId: updated.issueId,
    });

    return updated;
  }
}
