import { CommentRepository } from './ports/comment-repository';
import { EventPublisher } from './ports/event-publisher';
import { CommentNotFoundError, CommentNotOwnedByUserError } from '../domain/errors';

export class DeleteComment {
  constructor(
    private commentRepository: CommentRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(commentId: string, userId: string) {
    const existing = await this.commentRepository.findById(commentId);
    if (!existing) {
      throw new CommentNotFoundError();
    }

    if (existing.userId !== userId) {
      throw new CommentNotOwnedByUserError();
    }

    await this.commentRepository.softDelete(commentId);

    await this.eventPublisher.publish({
      type: 'comment.deleted',
      userId,
      timestamp: new Date(),
      commentId,
      issueId: existing.issueId,
    });
  }
}
