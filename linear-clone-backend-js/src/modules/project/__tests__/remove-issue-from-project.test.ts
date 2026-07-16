import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RemoveIssueFromProject } from '../application/remove-issue-from-project';
import { ProjectNotFoundError, NotProjectTeamMemberError } from '../domain/errors';

const PROJECT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const OTHER_TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456799';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';
const ISSUE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456720';

describe('RemoveIssueFromProject', () => {
  const mockProjectRepo = {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockIssueQuery = {
    findIssueById: vi.fn(),
  };

  const mockIssueUpdateQuery = {
    updateIssueProjectId: vi.fn(),
    getIssuesByProject: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const removeIssueFromProject = new RemoveIssueFromProject(
    mockProjectRepo,
    mockIssueQuery,
    mockIssueUpdateQuery,
    mockEventPublisher,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectRepo.findById.mockResolvedValue({
      id: PROJECT_ID,
      teamId: TEAM_ID,
      name: 'Test Project',
      description: null,
      status: 'in_progress',
      startDate: null,
      targetDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockIssueQuery.findIssueById.mockResolvedValue({
      id: ISSUE_ID,
      teamId: TEAM_ID,
      projectId: PROJECT_ID,
    });
  });

  it('should remove issue from project', async () => {
    await removeIssueFromProject.execute(PROJECT_ID, ISSUE_ID, USER_ID);

    expect(mockIssueUpdateQuery.updateIssueProjectId).toHaveBeenCalledWith(ISSUE_ID, null);
  });

  it('should reject when project not found', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);

    await expect(
      removeIssueFromProject.execute(PROJECT_ID, ISSUE_ID, USER_ID),
    ).rejects.toThrow(ProjectNotFoundError);
  });

  it('should reject when issue not found', async () => {
    mockIssueQuery.findIssueById.mockResolvedValue(null);

    await expect(
      removeIssueFromProject.execute(PROJECT_ID, ISSUE_ID, USER_ID),
    ).rejects.toThrow('Issue not found');
  });

  it('should reject when issue belongs to different team', async () => {
    mockIssueQuery.findIssueById.mockResolvedValue({
      id: ISSUE_ID,
      teamId: OTHER_TEAM_ID,
      projectId: PROJECT_ID,
    });

    await expect(
      removeIssueFromProject.execute(PROJECT_ID, ISSUE_ID, USER_ID),
    ).rejects.toThrow(NotProjectTeamMemberError);
  });

  it('should publish IssueProjectRemoved event', async () => {
    await removeIssueFromProject.execute(PROJECT_ID, ISSUE_ID, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'IssueProjectRemoved' }),
    );
  });
});
