import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignIssue } from '../application/assign-issue';
import { IssueNotFoundError, NotTeamMemberError } from '../domain/errors';

const ISSUE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';
const ASSIGNEE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456703';
const NON_MEMBER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456704';

describe('AssignIssue', () => {
  const mockIssueRepo = {
    findById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    getNextSequence: vi.fn(),
    findMany: vi.fn(),
    findByIdentifier: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockTeamMemberQuery = {
    isTeamMember: vi.fn().mockResolvedValue(true),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const assignIssue = new AssignIssue(mockIssueRepo, mockTeamMemberQuery, mockEventPublisher);

  const existingIssue = {
    id: ISSUE_ID,
    identifier: 'ENG-1',
    title: 'Test issue',
    description: null,
    teamId: 'a1b2c3d4-e5f6-4789-abcd-ef0123456710',
    projectId: null,
    assigneeId: null,
    priority: 0,
    statusId: 'a1b2c3d4-e5f6-4789-abcd-ef0123456720',
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

  it('should assign issue to a team member', async () => {
    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      assigneeId: ASSIGNEE_ID,
    });

    const result = await assignIssue.execute(
      ISSUE_ID,
      { assigneeId: ASSIGNEE_ID },
      USER_ID,
    );

    expect(result.assigneeId).toBe(ASSIGNEE_ID);
  });

  it('should unassign issue', async () => {
    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      assigneeId: null,
    });

    const result = await assignIssue.execute(
      ISSUE_ID,
      { assigneeId: null },
      USER_ID,
    );

    expect(result.assigneeId).toBeNull();
  });

  it('should reject non-team-member assignee', async () => {
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      assignIssue.execute(ISSUE_ID, { assigneeId: NON_MEMBER_ID }, USER_ID),
    ).rejects.toThrow(NotTeamMemberError);
  });

  it('should reject non-existent issue', async () => {
    mockIssueRepo.findById.mockResolvedValue(null);

    await expect(
      assignIssue.execute(
        'f0e1d2c3-b4a5-6789-8abc-def012349999',
        { assigneeId: ASSIGNEE_ID },
        USER_ID,
      ),
    ).rejects.toThrow(IssueNotFoundError);
  });
});
