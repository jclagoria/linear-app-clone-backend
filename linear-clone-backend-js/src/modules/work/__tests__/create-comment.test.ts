import { describe, it, expect, vi } from 'vitest';
import { ZodError } from 'zod';
import { CreateComment } from '../application/create-comment';
import { EmptyBodyError } from '../domain/errors';

const ISSUE_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456702';
const TEAM_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456703';

describe('CreateComment', () => {
  const mockCommentRepo = {
    findById: vi.fn(),
    findByIssueId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockTeamMemberQuery = {
    isTeamMember: vi.fn(),
  };

  const mockIssueTeamQuery = {
    getIssueTeamId: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const useCase = new CreateComment(
    mockCommentRepo,
    mockTeamMemberQuery,
    mockIssueTeamQuery,
    mockEventPublisher,
  );

  it('should create a comment successfully', async () => {
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockCommentRepo.create.mockResolvedValue({
      id: 'comment-1',
      issueId: ISSUE_ID,
      userId: USER_ID,
      body: 'Test comment',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await useCase.execute({ issueId: ISSUE_ID, body: 'Test comment' }, USER_ID);

    expect(result.body).toBe('Test comment');
    expect(mockCommentRepo.create).toHaveBeenCalledWith({
      issueId: ISSUE_ID,
      userId: USER_ID,
      body: 'Test comment',
    });
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'comment.created', issueId: ISSUE_ID }),
    );
  });

  it('should throw ZodError for empty body', async () => {
    await expect(
      useCase.execute({ issueId: ISSUE_ID, body: '' }, USER_ID),
    ).rejects.toThrow(ZodError);
  });

  it('should throw EmptyBodyError for whitespace-only body', async () => {
    await expect(
      useCase.execute({ issueId: ISSUE_ID, body: '   ' }, USER_ID),
    ).rejects.toThrow(EmptyBodyError);
  });

  it('should throw error for non-team-member', async () => {
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      useCase.execute({ issueId: ISSUE_ID, body: 'Comment' }, USER_ID),
    ).rejects.toThrow('User is not a member of this team');
  });

  it('should throw ZodError for invalid UUID', async () => {
    await expect(
      useCase.execute({ issueId: 'invalid-uuid', body: 'Comment' }, USER_ID),
    ).rejects.toThrow(ZodError);
  });
});
