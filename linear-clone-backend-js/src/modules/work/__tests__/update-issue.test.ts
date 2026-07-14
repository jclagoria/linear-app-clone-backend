import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateIssue } from '../application/update-issue';
import { IssueNotFoundError, TeamMismatchError } from '../domain/errors';

const ISSUE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456703';
const PROJECT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456704';
const OTHER_TEAM_PROJECT = 'a1b2c3d4-e5f6-4789-abcd-ef0123456705';

describe('UpdateIssue', () => {
  const mockIssueRepo = {
    findById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    getNextSequence: vi.fn(),
    findMany: vi.fn(),
    findByIdentifier: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockProjectQuery = {
    getProjectTeamId: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const updateIssue = new UpdateIssue(mockIssueRepo, mockProjectQuery, mockEventPublisher);

  const existingIssue = {
    id: ISSUE_ID,
    identifier: 'ENG-1',
    title: 'Original title',
    description: 'Original desc',
    teamId: TEAM_ID,
    projectId: null,
    assigneeId: null,
    priority: 2,
    statusId: 'a1b2c3d4-e5f6-4789-abcd-ef0123456710',
    parentId: null,
    cycleId: null,
    sortOrder: 0,
    sequence: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    canceledAt: null,
    deletedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockIssueRepo.findById.mockResolvedValue(existingIssue);
  });

  it('should update title only (partial update)', async () => {
    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      title: 'Updated title',
    });

    const result = await updateIssue.execute(
      ISSUE_ID,
      { title: 'Updated title' },
      USER_ID,
    );

    expect(result.title).toBe('Updated title');
    expect(mockIssueRepo.update).toHaveBeenCalledWith(ISSUE_ID, { title: 'Updated title' });
  });

  it('should reject non-existent issue', async () => {
    mockIssueRepo.findById.mockResolvedValue(null);

    await expect(
      updateIssue.execute('f0e1d2c3-b4a5-6789-8abc-def012349999', { title: 'New title' }, USER_ID),
    ).rejects.toThrow(IssueNotFoundError);
  });

  it('should reject project from different team', async () => {
    mockProjectQuery.getProjectTeamId.mockResolvedValue(OTHER_TEAM_PROJECT);

    await expect(
      updateIssue.execute(ISSUE_ID, { projectId: PROJECT_ID }, USER_ID),
    ).rejects.toThrow(TeamMismatchError);
  });

  it('should clear project when set to null', async () => {
    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      projectId: null,
    });

    const result = await updateIssue.execute(
      ISSUE_ID,
      { projectId: null },
      USER_ID,
    );

    expect(result.projectId).toBeNull();
  });

  it('should allow omitting all fields (no-op)', async () => {
    mockIssueRepo.update.mockResolvedValue(existingIssue);

    const result = await updateIssue.execute(ISSUE_ID, {}, USER_ID);

    expect(mockIssueRepo.update).toHaveBeenCalledWith(ISSUE_ID, {});
  });
});
