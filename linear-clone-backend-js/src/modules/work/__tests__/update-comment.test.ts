import { describe, it, expect, vi } from 'vitest';
import { ZodError } from 'zod';
import { UpdateComment } from '../application/update-comment';
import { CommentNotFoundError, CommentNotOwnedByUserError, EmptyBodyError } from '../domain/errors';

const COMMENT_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456710';
const USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456702';
const OTHER_USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456711';

describe('UpdateComment', () => {
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

  const useCase = new UpdateComment(mockCommentRepo, mockEventPublisher);

  it('should update a comment successfully', async () => {
    mockCommentRepo.findById.mockResolvedValue({
      id: COMMENT_ID,
      issueId: 'issue-1',
      userId: USER_ID,
      body: 'Old body',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    mockCommentRepo.update.mockResolvedValue({
      id: COMMENT_ID,
      issueId: 'issue-1',
      userId: USER_ID,
      body: 'Updated body',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await useCase.execute(COMMENT_ID, { body: 'Updated body' }, USER_ID);

    expect(result.body).toBe('Updated body');
    expect(mockCommentRepo.update).toHaveBeenCalledWith(COMMENT_ID, { body: 'Updated body' });
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'comment.updated' }),
    );
  });

  it('should throw CommentNotFoundError for non-existent comment', async () => {
    mockCommentRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(COMMENT_ID, { body: 'Body' }, USER_ID),
    ).rejects.toThrow(CommentNotFoundError);
  });

  it('should throw CommentNotOwnedByUserError for non-author', async () => {
    mockCommentRepo.findById.mockResolvedValue({
      id: COMMENT_ID,
      userId: OTHER_USER_ID,
      body: 'Body',
      issueId: 'issue-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await expect(
      useCase.execute(COMMENT_ID, { body: 'Body' }, USER_ID),
    ).rejects.toThrow(CommentNotOwnedByUserError);
  });

  it('should throw ZodError for empty body', async () => {
    await expect(
      useCase.execute(COMMENT_ID, { body: '' }, USER_ID),
    ).rejects.toThrow(ZodError);
  });
});
