import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ActivateCycle } from '../application/activate-cycle';
import { CycleNotFoundError, NotCycleTeamMemberError, InvalidCycleStatusTransitionError, CompletedCycleCannotBeActivatedError } from '../domain/errors';

const CYCLE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const ANOTHER_CYCLE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456711';
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

describe('ActivateCycle', () => {
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

  const activateCycle = new ActivateCycle(mockCycleRepo, mockTeamMemberQuery, mockEventPublisher);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should activate a Draft cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.findActiveByTeam.mockResolvedValue(null);
    mockCycleRepo.update.mockResolvedValue(makeCycle({ status: 'active', startDate: new Date().toISOString().split('T')[0] }));

    const result = await activateCycle.execute(CYCLE_ID, USER_ID);

    expect(result.status).toBe('active');
  });

  it('should auto-complete previously active cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.findActiveByTeam.mockResolvedValue(makeCycle({ id: ANOTHER_CYCLE_ID, status: 'active', name: 'Previous Sprint' }));
    mockCycleRepo.update.mockResolvedValue(makeCycle({ status: 'active' }));

    await activateCycle.execute(CYCLE_ID, USER_ID);

    expect(mockCycleRepo.update).toHaveBeenCalledWith(
      ANOTHER_CYCLE_ID,
      expect.objectContaining({ status: 'completed', completedAt: expect.any(Date) }),
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CycleCompleted', cycleId: ANOTHER_CYCLE_ID }),
    );
  });

  it('should reject already active cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle({ status: 'active' }));
    await expect(
      activateCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(InvalidCycleStatusTransitionError);
  });

  it('should reject completed cycle', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle({ status: 'completed' }));
    await expect(
      activateCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(CompletedCycleCannotBeActivatedError);
  });

  it('should reject non-member', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);
    await expect(
      activateCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(NotCycleTeamMemberError);
  });

  it('should reject cycle not found', async () => {
    mockCycleRepo.findById.mockResolvedValue(null);
    await expect(
      activateCycle.execute(CYCLE_ID, USER_ID),
    ).rejects.toThrow(CycleNotFoundError);
  });

  it('should publish CycleActivated event', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.findActiveByTeam.mockResolvedValue(null);
    mockCycleRepo.update.mockResolvedValue(makeCycle({ status: 'active' }));

    await activateCycle.execute(CYCLE_ID, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CycleActivated', cycleId: CYCLE_ID }),
    );
  });
});
