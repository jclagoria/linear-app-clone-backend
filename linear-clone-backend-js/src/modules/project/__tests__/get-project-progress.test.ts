import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProjectProgress } from '../application/get-project-progress';
import { ProjectNotFoundError, NotProjectTeamMemberError } from '../domain/errors';

const PROJECT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

describe('GetProjectProgress', () => {
  const mockProjectRepo = {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockTeamMemberQuery = {
    isTeamMember: vi.fn(),
  };

  const mockIssueQuery = {
    countProjectIssues: vi.fn(),
    countCompletedProjectIssues: vi.fn(),
    getIssuesByProject: vi.fn(),
  };

  const getProjectProgress = new GetProjectProgress(mockProjectRepo, mockTeamMemberQuery, mockIssueQuery);

  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectRepo.findById.mockResolvedValue({
      id: PROJECT_ID,
      teamId: TEAM_ID,
      name: 'Test Project',
      status: 'in_progress',
    });
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should calculate progress with mixed issues', async () => {
    mockIssueQuery.countProjectIssues.mockResolvedValue(10);
    mockIssueQuery.countCompletedProjectIssues.mockResolvedValue(4);

    const result = await getProjectProgress.execute(PROJECT_ID, USER_ID);

    expect(result.progress).toBe(40);
    expect(result.totalIssues).toBe(10);
    expect(result.completedIssues).toBe(4);
  });

  it('should return 0 progress when no issues exist', async () => {
    mockIssueQuery.countProjectIssues.mockResolvedValue(0);
    mockIssueQuery.countCompletedProjectIssues.mockResolvedValue(0);

    const result = await getProjectProgress.execute(PROJECT_ID, USER_ID);

    expect(result.progress).toBe(0);
    expect(result.totalIssues).toBe(0);
    expect(result.completedIssues).toBe(0);
  });

  it('should return 100 progress when all issues completed', async () => {
    mockIssueQuery.countProjectIssues.mockResolvedValue(8);
    mockIssueQuery.countCompletedProjectIssues.mockResolvedValue(8);

    const result = await getProjectProgress.execute(PROJECT_ID, USER_ID);

    expect(result.progress).toBe(100);
    expect(result.totalIssues).toBe(8);
    expect(result.completedIssues).toBe(8);
  });

  it('should reject non-member user', async () => {
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      getProjectProgress.execute(PROJECT_ID, USER_ID),
    ).rejects.toThrow(NotProjectTeamMemberError);
  });

  it('should reject project not found', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);

    await expect(
      getProjectProgress.execute(PROJECT_ID, USER_ID),
    ).rejects.toThrow(ProjectNotFoundError);
  });
});
