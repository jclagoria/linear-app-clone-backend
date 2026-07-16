import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateCycle } from '../application/update-cycle';
import { CycleNotFoundError, EmptyCycleNameError, NotCycleTeamMemberError, CycleDateValidationError } from '../domain/errors';

const CYCLE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

function makeCycle(overrides = {}) {
  return {
    id: CYCLE_ID,
    teamId: TEAM_ID,
    name: 'Original Sprint',
    description: 'Original description',
    status: 'draft',
    startDate: '2026-08-01',
    endDate: '2026-08-14',
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    ...overrides,
  };
}

describe('UpdateCycle', () => {
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

  const updateCycle = new UpdateCycle(mockCycleRepo, mockTeamMemberQuery, mockEventPublisher);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should update cycle name', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.update.mockResolvedValue(makeCycle({ name: 'Updated Sprint' }));

    const result = await updateCycle.execute(CYCLE_ID, { name: 'Updated Sprint' }, USER_ID);

    expect(result.name).toBe('Updated Sprint');
    expect(mockCycleRepo.update).toHaveBeenCalledWith(CYCLE_ID, expect.objectContaining({ name: 'Updated Sprint' }));
  });

  it('should reject empty name', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    await expect(
      updateCycle.execute(CYCLE_ID, { name: '' }, USER_ID),
    ).rejects.toThrow(EmptyCycleNameError);
  });

  it('should reject non-member user', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);
    await expect(
      updateCycle.execute(CYCLE_ID, { name: 'Test' }, USER_ID),
    ).rejects.toThrow(NotCycleTeamMemberError);
  });

  it('should reject cycle not found', async () => {
    mockCycleRepo.findById.mockResolvedValue(null);
    await expect(
      updateCycle.execute(CYCLE_ID, { name: 'Test' }, USER_ID),
    ).rejects.toThrow(CycleNotFoundError);
  });

  it('should update dates in Draft status', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.update.mockResolvedValue(makeCycle({ startDate: '2026-08-05', endDate: '2026-08-20' }));

    const result = await updateCycle.execute(CYCLE_ID, { startDate: '2026-08-05', endDate: '2026-08-20' }, USER_ID);
    expect(result).toBeDefined();
  });

  it('should reject date modification outside Draft', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle({ status: 'active' }));
    await expect(
      updateCycle.execute(CYCLE_ID, { startDate: '2026-09-01' }, USER_ID),
    ).rejects.toThrow(CycleDateValidationError);
  });

  it('should preserve omitted fields during partial update', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.update.mockResolvedValue(makeCycle({ name: 'Sprint 2' }));

    const result = await updateCycle.execute(CYCLE_ID, { name: 'Sprint 2' }, USER_ID);

    expect(result.name).toBe('Sprint 2');
    expect(mockCycleRepo.update).toHaveBeenCalledWith(
      CYCLE_ID,
      expect.not.objectContaining({ description: expect.anything() }),
    );
  });

  it('should publish CycleUpdated event', async () => {
    mockCycleRepo.findById.mockResolvedValue(makeCycle());
    mockCycleRepo.update.mockResolvedValue(makeCycle({ name: 'Updated' }));

    await updateCycle.execute(CYCLE_ID, { name: 'Updated' }, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CycleUpdated', userId: USER_ID }),
    );
  });
});
