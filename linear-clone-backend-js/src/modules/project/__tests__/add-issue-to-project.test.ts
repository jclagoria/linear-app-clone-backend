import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddIssueToProject } from '../application/add-issue-to-project';
import { ProjectNotFoundError, NotProjectTeamMemberError, IssueAlreadyInProjectError } from '../domain/errors';

const PROJECT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const OTHER_TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456799';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';
const ISSUE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456720';

describe('AddIssueToProject', () => {
  const mockProjectRepo = {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockIssueQuery = {
    findIssueById: vi.fn(),
    countProjectIssues: vi.fn(),
    countCompletedProjectIssues: vi.fn(),
    getIssuesByProject: vi.fn(),
  };

  const mockIssueUpdateQuery = {
    updateIssueProjectId: vi.fn(),
    getIssuesByProject: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const addIssueToProject = new AddIssueToProject(mockProjectRepo, mockIssueQuery, mockIssueUpdateQuery, mockEventPublisher);

  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectRepo.findById.mockResolvedValue({
      id: PROJECT_ID,
      teamId: TEAM_ID,
      name: 'Test Project',
      status: 'in_progress',
    });
    mockIssueQuery.findIssueById.mockResolvedValue({
      id: ISSUE_ID,
      teamId: TEAM_ID,
      projectId: null,
    });
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
  });

  it('should add issue to project', async () => {
    mockIssueQuery.findIssueById.mockResolvedValue({
      id: ISSUE_ID,
      teamId: TEAM_ID,
      projectId: null,
    });

    const result = await addIssueToProject.execute(
      PROJECT_ID,
      { issueId: ISSUE_ID },
      USER_ID,
    );

    expect(mockIssueUpdateQuery.updateIssueProjectId).toHaveBeenCalledWith(ISSUE_ID, PROJECT_ID);
    expect(result).toBeDefined();
  });

  it('should reject when project not found', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);

    await expect(
      addIssueToProject.execute(PROJECT_ID, { issueId: ISSUE_ID }, USER_ID),
    ).rejects.toThrow(ProjectNotFoundError);
  });

  it('should reject when issue not found', async () => {
    mockIssueQuery.findIssueById.mockResolvedValue(null);

    await expect(
      addIssueToProject.execute(PROJECT_ID, { issueId: ISSUE_ID }, USER_ID),
    ).rejects.toThrow('Issue not found');
  });

  it('should reject when issue belongs to different team', async () => {
    mockIssueQuery.findIssueById.mockResolvedValue({
      id: ISSUE_ID,
      teamId: OTHER_TEAM_ID,
      projectId: null,
    });

    await expect(
      addIssueToProject.execute(PROJECT_ID, { issueId: ISSUE_ID }, USER_ID),
    ).rejects.toThrow(NotProjectTeamMemberError);
  });

  it('should reject when issue already in another project', async () => {
    mockIssueQuery.findIssueById.mockResolvedValue({
      id: ISSUE_ID,
      teamId: TEAM_ID,
      projectId: 'some-other-project-id',
    });

    await expect(
      addIssueToProject.execute(PROJECT_ID, { issueId: ISSUE_ID }, USER_ID),
    ).rejects.toThrow(IssueAlreadyInProjectError);
  });

  it('should publish IssueProjectAssociated event', async () => {
    mockIssueQuery.findIssueById.mockResolvedValue({
      id: ISSUE_ID,
      teamId: TEAM_ID,
      projectId: null,
    });

    await addIssueToProject.execute(PROJECT_ID, { issueId: ISSUE_ID }, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'IssueProjectAssociated' }),
    );
  });
});
