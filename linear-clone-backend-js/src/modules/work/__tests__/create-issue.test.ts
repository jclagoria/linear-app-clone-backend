import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateIssue } from '../application/create-issue';
import { EmptyTitleError, NotTeamMemberError, TeamMismatchError } from '../domain/errors';
import { ZodError } from 'zod';

const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';
const ASSIGNEE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456703';
const PARENT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456704';
const PARENT_TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456705';
const PROJECT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456706';

describe('CreateIssue', () => {
  const mockIssueRepo = {
    findById: vi.fn(),
    create: vi.fn(),
    getNextSequence: vi.fn(),
    findMany: vi.fn(),
    findByIdentifier: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockTeamMemberQuery = {
    isTeamMember: vi.fn(),
  };

  const mockProjectQuery = {
    getProjectTeamId: vi.fn(),
  };

  const mockTeamKeyQuery = {
    getTeamKey: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const defaultStatusId = 'a1b2c3d4-e5f6-4789-abcd-ef0123456799';

  const createIssue = new CreateIssue(
    mockIssueRepo,
    mockTeamMemberQuery,
    mockProjectQuery,
    mockTeamKeyQuery,
    defaultStatusId,
    mockEventPublisher,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockIssueRepo.getNextSequence.mockResolvedValue(1);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockProjectQuery.getProjectTeamId.mockResolvedValue(TEAM_ID);
    mockTeamKeyQuery.getTeamKey.mockResolvedValue('ENG');
  });

  it('should create an issue with minimal fields', async () => {
    mockIssueRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456100',
      identifier: 'ENG-1',
      title: 'Test issue',
      description: null,
      teamId: TEAM_ID,
      projectId: null,
      assigneeId: null,
      priority: 0,
      statusId: defaultStatusId,
      parentId: null,
      cycleId: null,
      sortOrder: 0,
      sequence: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
      canceledAt: null,
      deletedAt: null,
    });

    const result = await createIssue.execute(
      {
        title: 'Test issue',
        teamId: TEAM_ID,
        priority: 0,
      },
      USER_ID,
    );

    expect(result.title).toBe('Test issue');
    expect(result.identifier).toBe('ENG-1');
    expect(result.priority).toBe(0);
    expect(result.statusId).toBe(defaultStatusId);
    expect(mockIssueRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: 'ENG-1' }),
    );
  });

  it('should reject empty title', async () => {
    await expect(
      createIssue.execute({ title: '', teamId: TEAM_ID, priority: 0 }, USER_ID),
    ).rejects.toThrow(EmptyTitleError);
  });

  it('should reject non-team-member user', async () => {
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      createIssue.execute({ title: 'Test', teamId: TEAM_ID, priority: 0 }, USER_ID),
    ).rejects.toThrow(NotTeamMemberError);
  });

  it('should reject parent issue from different team', async () => {
    mockIssueRepo.findById.mockResolvedValue({
      id: PARENT_ID,
      teamId: PARENT_TEAM_ID,
      deletedAt: null,
    });

    await expect(
      createIssue.execute(
        { title: 'Test', teamId: TEAM_ID, parentId: PARENT_ID, priority: 0 },
        USER_ID,
      ),
    ).rejects.toThrow(TeamMismatchError);
  });

  it('should reject assignee not in team', async () => {
    mockTeamMemberQuery.isTeamMember
      .mockResolvedValueOnce(true) // user is member
      .mockResolvedValueOnce(false); // assignee is not

    await expect(
      createIssue.execute(
        { title: 'Test', teamId: TEAM_ID, assigneeId: ASSIGNEE_ID, priority: 0 },
        USER_ID,
      ),
    ).rejects.toThrow(NotTeamMemberError);
  });

  it('should set default priority to 0', async () => {
    mockIssueRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456101',
      identifier: 'ENG-2',
      title: 'Test',
      description: null,
      teamId: TEAM_ID,
      projectId: null,
      assigneeId: null,
      priority: 0,
      statusId: defaultStatusId,
      parentId: null,
      cycleId: null,
      sortOrder: 0,
      sequence: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
      canceledAt: null,
      deletedAt: null,
    });

    const result = await createIssue.execute(
      { title: 'Test', teamId: TEAM_ID, priority: 0 },
      USER_ID,
    );

    expect(result.priority).toBe(0);
  });
});
