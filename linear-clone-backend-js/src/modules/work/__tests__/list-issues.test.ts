import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListIssues } from '../application/list-issues';

describe('ListIssues', () => {
  const mockIssueRepo = {
    findMany: vi.fn(),
    findById: vi.fn(),
    findByIdentifier: vi.fn(),
    create: vi.fn(),
    getNextSequence: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  };

  const listIssues = new ListIssues(mockIssueRepo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list issues with default pagination', async () => {
    mockIssueRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { nextCursor: null, hasMore: false },
    });

    const result = await listIssues.execute({});

    expect(mockIssueRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ includeDeleted: false }),
      undefined,
      50,
    );
    expect(result.pagination.hasMore).toBe(false);
  });

  it('should apply team filter', async () => {
    mockIssueRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { nextCursor: null, hasMore: false },
    });

    await listIssues.execute({ teamId: 'a1b2c3d4-e5f6-4789-abcd-ef0123456701' });

    expect(mockIssueRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ teamId: 'a1b2c3d4-e5f6-4789-abcd-ef0123456701' }),
      undefined,
      50,
    );
  });

  it('should accept limit within range', async () => {
    mockIssueRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { nextCursor: null, hasMore: false },
    });

    await listIssues.execute({ limit: 50 });

    expect(mockIssueRepo.findMany).toHaveBeenCalledWith(
      expect.anything(),
      undefined,
      50,
    );
  });

  it('should pass cursor for pagination', async () => {
    mockIssueRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { nextCursor: 'cursor-2', hasMore: false },
    });

    await listIssues.execute({ cursor: 'cursor-1' });

    expect(mockIssueRepo.findMany).toHaveBeenCalledWith(
      expect.anything(),
      'cursor-1',
      50,
    );
  });

  it('should exclude soft-deleted issues by default', async () => {
    mockIssueRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { nextCursor: null, hasMore: false },
    });

    await listIssues.execute({});

    expect(mockIssueRepo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ includeDeleted: false }),
      undefined,
      50,
    );
  });
});
