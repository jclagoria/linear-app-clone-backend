import { describe, it, expect, vi } from 'vitest';
import { ListIssueComments } from '../application/list-issue-comments';

const ISSUE_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456701';

describe('ListIssueComments', () => {
  const mockCommentRepo = {
    findById: vi.fn(),
    findByIssueId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  };

  const useCase = new ListIssueComments(mockCommentRepo);

  it('should return comments for an issue', async () => {
    const comments = [
      { id: 'c1', issueId: ISSUE_ID, userId: 'u1', body: 'First', createdAt: new Date('2024-01-01'), updatedAt: new Date(), deletedAt: null },
      { id: 'c2', issueId: ISSUE_ID, userId: 'u2', body: 'Second', createdAt: new Date('2024-01-02'), updatedAt: new Date(), deletedAt: null },
    ];
    mockCommentRepo.findByIssueId.mockResolvedValue(comments);

    const result = await useCase.execute(ISSUE_ID);

    expect(result).toHaveLength(2);
    expect(result[0].body).toBe('First');
    expect(mockCommentRepo.findByIssueId).toHaveBeenCalledWith(ISSUE_ID);
  });

  it('should return empty array when no comments exist', async () => {
    mockCommentRepo.findByIssueId.mockResolvedValue([]);

    const result = await useCase.execute(ISSUE_ID);

    expect(result).toHaveLength(0);
  });
});
