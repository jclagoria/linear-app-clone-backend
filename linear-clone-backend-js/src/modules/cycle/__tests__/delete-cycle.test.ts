import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCycle } from '../application/delete-cycle';
import { CycleNotFoundError, NotCycleTeamMemberError, ActiveCycleCannotBeDeletedError } from '../domain/errors';

const CYCLE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

function makeCycle(overrides = {}) {
  return {
    id: CYCLE_ID,
    teamId: TEAM_ID,
    name: 'Sprint 1',
    description: null,
    status: 'draft',
    startDate: '2026-08-01',
    endDate: '2026-08-14',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    ...overrides,
  };
}

describe('DeleteCycle', () => {
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

  const deleteCycle = new DeleteCycle(mockCycleRepo, mockTeamMemberQuery);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should delete a Draft cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());

    await deleteCycle.execute(CYCLE_ID, USER_ID);

    expect(mockCycleRepo.delete).toHaveBeenCalledWith(CYCLE_ID);
  });

  it('should reject deleting Active cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle({ status: 'active' }));
    await expect(
      deleteCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(ActiveCycleCannotBeDeletedError);
  });

  it('should reject deleting Completed cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle({ status: 'completed' }));
    await expect(
      deleteCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(ActiveCycleCannotBeDeletedError);
  });

  it('should reject non-member', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);
    await expect(
      deleteCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(NotCycleTeamMemberError);
  });

  it('should reject cycle not found', async () => {
    mockCycleRepo.findById.mockResolvedValue(null);
    await expect(
      deleteCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(CycleNotFoundError);
  });
});
