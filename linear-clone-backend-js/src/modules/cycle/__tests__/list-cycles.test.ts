import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListCycles } from '../application/list-cycles';
import { NotCycleTeamMemberError } from '../domain/errors';

const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

describe('ListCycles', () => {
  const mockCycleRepo = {
    findById: vi.fn(),
    findMany: vi.fn(),
    findByTeam: vi.fn(),
    findActiveByTeam: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockTeamMemberQuery = {
    isTeamMember: vi.fn(),
  };

  const listCycles = new ListCycles(mockCycleRepo, mockTeamMemberQuery);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should list cycles for a team', async () => {
    const mockResult = {
      data: [
        { id: '1', teamId: TEAM_ID, name: 'Sprint 2', status: 'draft', startDate: '2026-09-01', endDate: '2026-09-14', createdAt: new Date(), updatedAt: new Date(), completedAt: null },
        { id: '2', teamId: TEAM_ID, name: 'Sprint 1', status: 'active', startDate: '2026-08-01', endDate: '2026-08-14', createdAt: new Date(), updatedAt: new Date(), completedAt: null },
      ],
      pagination: { nextCursor: null, hasMore: false },
    };
    mockCycleRepo.findByTeam.mockResolvedValue(mockResult);

    const result = await listCycles.execute(TEAM_ID, USER_ID);

    expect(result.data).toHaveLength(2);
    expect(mockCycleRepo.findByTeam).toHaveBeenCalledWith(TEAM_ID, undefined, undefined, undefined);
  });

  it('should filter cycles by status', async () => {
    const mockResult = {
      data: [
        { id: '2', teamId: TEAM_ID, name: 'Sprint 1', status: 'active', startDate: '2026-08-01', endDate: '2026-08-14', createdAt: new Date(), updatedAt: new Date(), completedAt: null },
      ],
      pagination: { nextCursor: null, hasMore: false },
    };
    mockCycleRepo.findByTeam.mockResolvedValue(mockResult);

    const result = await listCycles.execute(TEAM_ID, USER_ID, 'active');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].status).toBe('active');
    expect(mockCycleRepo.findByTeam).toHaveBeenCalledWith(TEAM_ID, 'active', undefined, undefined);
  });

  it('should support cursor-based pagination', async () => {
    const mockResult = {
      data: [],
      pagination: { nextCursor: null, hasMore: false },
    };
    mockCycleRepo.findByTeam.mockResolvedValue(mockResult);

    await listCycles.execute(TEAM_ID, USER_ID, undefined, 'cursor123', 10);

    expect(mockCycleRepo.findByTeam).toHaveBeenCalledWith(TEAM_ID, undefined, 'cursor123', 10);
  });

  it('should reject non-member', async () => {
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);
    await expect(
      listCycles.execute(TEAM_ID, USER_ID),
    ).rejects.toThrow(NotCycleTeamMemberError);
  });
});
