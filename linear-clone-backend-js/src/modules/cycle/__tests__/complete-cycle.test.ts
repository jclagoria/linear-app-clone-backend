import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompleteCycle } from '../application/complete-cycle';
import { CycleNotFoundError, NotCycleTeamMemberError, DraftCycleCannotBeCompletedError } from '../domain/errors';

const CYCLE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

function makeCycle(overrides = {}) {
  return {
    id: CYCLE_ID,
    teamId: TEAM_ID,
    name: 'Sprint 1',
    description: null,
    status: 'active',
    startDate: '2026-08-01',
    endDate: '2026-08-14',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    ...overrides,
  };
}

describe('CompleteCycle', () => {
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

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const completeCycle = new CompleteCycle(mockCycleRepo, mockTeamMemberQuery, mockEventPublisher);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should complete an active cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.update.mockResolvedValue(makeCycle({ status: 'completed', completedAt: new Date() }));

    const result = await completeCycle.execute(CYCLE_ID, USER_ID);

    expect(result.status).toBe('completed');
    expect(mockCycleRepo.update).toHaveBeenCalledWith(
      CYCLE_ID,
      expect.objectContaining({ status: 'completed', completedAt: expect.any(Date) }),
    );
  });

  it('should reject Draft cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle({ status: 'draft' }));
    await expect(
      completeCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(DraftCycleCannotBeCompletedError);
  });

  it('should reject already completed cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle({ status: 'completed' }));
    await expect(
      completeCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(DraftCycleCannotBeCompletedError);
  });

  it('should reject non-member', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);
    await expect(
      completeCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(NotCycleTeamMemberError);
  });

  it('should reject cycle not found', async () => {
    mockCycleRepo.findById.mockResolvedValue(null);
    await expect(
      completeCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(CycleNotFoundError);
  });

  it('should publish CycleCompleted event', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.update.mockResolvedValue(makeCycle({ status: 'completed', completedAt: new Date() }));

    await completeCycle.execute(CYCLE_ID, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CycleCompleted' }),
    );
  });
});
