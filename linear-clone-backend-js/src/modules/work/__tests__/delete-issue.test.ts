import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteIssue } from '../application/delete-issue';
import { IssueNotFoundError } from '../domain/errors';

const ISSUE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

describe('DeleteIssue', () => {
  const mockIssueRepo = {
    findById: vi.fn(),
    softDelete: vi.fn(),
    create: vi.fn(),
    getNextSequence: vi.fn(),
    findMany: vi.fn(),
    findByIdentifier: vi.fn(),
    update: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const deleteIssue = new DeleteIssue(mockIssueRepo, mockEventPublisher);

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

  it('should soft-delete an issue', async () => {
    await deleteIssue.execute(ISSUE_ID, USER_ID);

    expect(mockIssueRepo.softDelete).toHaveBeenCalledWith(ISSUE_ID);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'IssueDeleted', issueId: ISSUE_ID }),
    );
  });

  it('should reject non-existent issue', async () => {
    mockIssueRepo.findById.mockResolvedValue(null);

    await expect(
      deleteIssue.execute('f0e1d2c3-b4a5-6789-8abc-def012349999', USER_ID),
    ).rejects.toThrow(IssueNotFoundError);
  });
});
