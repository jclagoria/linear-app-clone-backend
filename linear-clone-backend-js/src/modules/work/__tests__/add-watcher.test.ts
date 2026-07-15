import { describe, it, expect, vi } from 'vitest';
import { AddWatcher } from '../application/add-watcher';
import { AlreadyWatchingError } from '../domain/errors';

const ISSUE_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456702';
const TARGET_USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456760';
const TEAM_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456703';

describe('AddWatcher', () => {
  const mockWatcherRepo = {
    findByIssueId: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  };

  const mockTeamMemberQuery = { isTeamMember: vi.fn() };
  const mockIssueTeamQuery = { getIssueTeamId: vi.fn() };
  const mockEventPublisher = { publish: vi.fn() };

  const useCase = new AddWatcher(
    mockWatcherRepo, mockTeamMemberQuery, mockIssueTeamQuery, mockEventPublisher,
  );

  it('should add a watcher successfully (self-watch)', async () => {
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockWatcherRepo.findOne.mockResolvedValue(null);
    mockWatcherRepo.create.mockResolvedValue({
      id: 'watch-1', issueId: ISSUE_ID, userId: USER_ID, createdAt: new Date(),
    });

    const result = await useCase.execute({ issueId: ISSUE_ID }, USER_ID);

    expect(result.userId).toBe(USER_ID);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'issue.watcher.added' }),
    );
  });

  it('should add another user as watcher when userId provided', async () => {
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockWatcherRepo.findOne.mockResolvedValue(null);
    mockWatcherRepo.create.mockResolvedValue({
      id: 'watch-1', issueId: ISSUE_ID, userId: TARGET_USER_ID, createdAt: new Date(),
    });

    const result = await useCase.execute({ issueId: ISSUE_ID, userId: TARGET_USER_ID }, USER_ID);

    expect(result.userId).toBe(TARGET_USER_ID);
  });

  it('should throw AlreadyWatchingError for duplicate watch', async () => {
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockWatcherRepo.findOne.mockResolvedValue({
      id: 'watch-1', issueId: ISSUE_ID, userId: USER_ID, createdAt: new Date(),
    });

    await expect(
      useCase.execute({ issueId: ISSUE_ID }, USER_ID),
    ).rejects.toThrow(AlreadyWatchingError);
  });

  it('should throw error for non-team-member', async () => {
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      useCase.execute({ issueId: ISSUE_ID }, USER_ID),
    ).rejects.toThrow('User is not a member of this team');
  });
});
