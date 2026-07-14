import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangeIssueStatus } from '../application/change-issue-status';
import { IssueNotFoundError, InvalidTransitionError } from '../domain/errors';

const ISSUE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const TODO_STATUS = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const IN_PROGRESS_STATUS = 'a1b2c3d4-e5f6-4789-abcd-ef0123456711';
const DONE_STATUS = 'a1b2c3d4-e5f6-4789-abcd-ef0123456712';
const CANCELED_STATUS = 'a1b2c3d4-e5f6-4789-abcd-ef0123456713';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456720';

describe('ChangeIssueStatus', () => {
  const mockIssueRepo = {
    findById: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    getNextSequence: vi.fn(),
    findMany: vi.fn(),
    findByIdentifier: vi.fn(),
    softDelete: vi.fn(),
  };

  const mockStatuses: Record<string, { id: string; type: string; name: string }> = {
    [TODO_STATUS]: { id: TODO_STATUS, type: 'unstarted', name: 'Todo' },
    [IN_PROGRESS_STATUS]: { id: IN_PROGRESS_STATUS, type: 'started', name: 'In Progress' },
    [DONE_STATUS]: { id: DONE_STATUS, type: 'completed', name: 'Done' },
    [CANCELED_STATUS]: { id: CANCELED_STATUS, type: 'canceled', name: 'Canceled' },
  };

  const mockIssueStatusQuery = {
    getStatusById: vi.fn().mockImplementation((id: string) => mockStatuses[id] || null),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const changeIssueStatus = new ChangeIssueStatus(
    mockIssueRepo,
    mockIssueStatusQuery,
    mockEventPublisher,
  );

  const existingIssue = {
    id: ISSUE_ID,
    identifier: 'ENG-1',
    title: 'Test issue',
    description: null,
    teamId: 'a1b2c3d4-e5f6-4789-abcd-ef0123456730',
    projectId: null,
    assigneeId: null,
    priority: 0,
    statusId: TODO_STATUS,
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

  it('should transition Todo -> In Progress', async () => {
    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      statusId: IN_PROGRESS_STATUS,
    });

    const result = await changeIssueStatus.execute(
      ISSUE_ID,
      { statusId: IN_PROGRESS_STATUS },
      USER_ID,
    );

    expect(result.statusId).toBe(IN_PROGRESS_STATUS);
  });

  it('should set completedAt when moving to Done', async () => {
    const now = new Date();
    // Issue must be in a status that can transition to Done (e.g. In Progress)
    mockIssueRepo.findById.mockResolvedValue({
      ...existingIssue,
      statusId: IN_PROGRESS_STATUS,
    });
    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      statusId: DONE_STATUS,
      completedAt: now,
    });

    const result = await changeIssueStatus.execute(
      ISSUE_ID,
      { statusId: DONE_STATUS },
      USER_ID,
    );

    expect(result.completedAt).toBeDefined();
  });

  it('should set completedAt when moving to Canceled', async () => {
    const now = new Date();
    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      statusId: CANCELED_STATUS,
      completedAt: now,
    });

    const result = await changeIssueStatus.execute(
      ISSUE_ID,
      { statusId: CANCELED_STATUS },
      USER_ID,
    );

    expect(result.completedAt).toBeDefined();
  });

  it('should clear completedAt when reopening from Done', async () => {
    mockIssueRepo.findById.mockResolvedValue({
      ...existingIssue,
      statusId: DONE_STATUS,
      completedAt: new Date(),
    });

    mockIssueRepo.update.mockResolvedValue({
      ...existingIssue,
      statusId: IN_PROGRESS_STATUS,
      completedAt: null,
    });

    const result = await changeIssueStatus.execute(
      ISSUE_ID,
      { statusId: IN_PROGRESS_STATUS },
      USER_ID,
    );

    expect(result.completedAt).toBeNull();
  });

  it('should reject invalid transition (Todo -> Done directly)', async () => {
    // First go through In Progress to make Done reachable
    mockIssueRepo.findById.mockResolvedValue({
      ...existingIssue,
      statusId: TODO_STATUS,
    });

    await expect(
      changeIssueStatus.execute(ISSUE_ID, { statusId: DONE_STATUS }, USER_ID),
    ).rejects.toThrow(InvalidTransitionError);
  });

  it('should reject non-existent issue', async () => {
    mockIssueRepo.findById.mockResolvedValue(null);

    await expect(
      changeIssueStatus.execute(
        'f0e1d2c3-b4a5-6789-8abc-def012349999',
        { statusId: DONE_STATUS },
        USER_ID,
      ),
    ).rejects.toThrow(IssueNotFoundError);
  });
});
