import { describe, it, expect, vi } from 'vitest';
import { DeleteComment } from '../application/delete-comment';
import { CommentNotFoundError, CommentNotOwnedByUserError } from '../domain/errors';

const COMMENT_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456720';
const USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456702';
const OTHER_USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456711';

describe('DeleteComment', () => {
  const mockCommentRepo = {
    findById: vi.fn(),
    findByIssueId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const useCase = new DeleteComment(mockCommentRepo, mockEventPublisher);

  it('should delete a comment successfully', async () => {
    mockCommentRepo.findById.mockResolvedValue({
      id: COMMENT_ID,
      issueId: 'issue-1',
      userId: USER_ID,
      body: 'Body',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await useCase.execute(COMMENT_ID, USER_ID);

    expect(mockCommentRepo.softDelete).toHaveBeenCalledWith(COMMENT_ID);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'comment.deleted' }),
    );
  });

  it('should throw CommentNotFoundError for non-existent comment', async () => {
    mockCommentRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(COMMENT_ID, USER_ID),
    ).rejects.toThrow(CommentNotFoundError);
  });

  it('should throw CommentNotOwnedByUserError for non-author', async () => {
    mockCommentRepo.findById.mockResolvedValue({
      id: COMMENT_ID,
      issueId: 'issue-1',
      userId: OTHER_USER_ID,
      body: 'Body',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await expect(
      useCase.execute(COMMENT_ID, USER_ID),
    ).rejects.toThrow(CommentNotOwnedByUserError);
  });
});
