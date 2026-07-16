import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCycle } from '../application/get-cycle';
import { CycleNotFoundError, NotCycleTeamMemberError } from '../domain/errors';

const CYCLE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

function makeCycle(overrides = {}) {
  return {
    id: CYCLE_ID,
    teamId: TEAM_ID,
    name: 'Sprint 1',
    description: 'First sprint',
    status: 'active',
    startDate: '2026-08-01',
    endDate: '2026-08-14',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    ...overrides,
  };
}

describe('GetCycle', () => {
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

  const getCycle = new GetCycle(mockCycleRepo, mockTeamMemberQuery);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should return cycle by ID', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());

    const result = await getCycle.execute(CYCLE_ID, USER_ID);

    expect(result.id).toBe(CYCLE_ID);
    expect(result.name).toBe('Sprint 1');
    expect(result.status).toBe('active');
  });

  it('should throw CycleNotFoundError for non-existent cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(null);
    await expect(
      getCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(CycleNotFoundError);
  });

  it('should throw NotCycleTeamMemberError for non-member', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);
    await expect(
      getCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(NotCycleTeamMemberError);
  });
});
