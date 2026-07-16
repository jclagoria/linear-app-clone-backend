import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateCycle } from '../application/create-cycle';
import { EmptyCycleNameError, NotCycleTeamMemberError, CycleDateValidationError, CyclePastStartDateError } from '../domain/errors';

const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

describe('CreateCycle', () => {
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

  const createCycle = new CreateCycle(mockCycleRepo, mockTeamMemberQuery, mockEventPublisher);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  const futureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  const futureDatePlus10 = () => {
    const d = new Date();
    d.setDate(d.getDate() + 40);
    return d.toISOString().split('T')[0];
  };

  it('should create a cycle with valid dates', async () => {
    const start = futureDate();
    const end = futureDatePlus10();
    mockCycleRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456710',
      teamId: TEAM_ID,
      name: 'Sprint 1',
      description: null,
      status: 'draft',
      startDate: start,
      endDate: end,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    });

    const result = await createCycle.execute(
      { teamId: TEAM_ID, name: 'Sprint 1', startDate: start, endDate: end },
      USER_ID,
    );

    expect(result.name).toBe('Sprint 1');
    expect(result.status).toBe('draft');
    expect(mockCycleRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Sprint 1', status: 'draft' }),
    );
  });

  it('should reject empty name', async () => {
    const start = futureDate();
    const end = futureDatePlus10();
    await expect(
      createCycle.execute({ teamId: TEAM_ID, name: '', startDate: start, endDate: end }, USER_ID),
    ).rejects.toThrow(EmptyCycleNameError);
  });

  it('should reject name with only whitespace', async () => {
    const start = futureDate();
    const end = futureDatePlus10();
    await expect(
      createCycle.execute({ teamId: TEAM_ID, name: '   ', startDate: start, endDate: end }, USER_ID),
    ).rejects.toThrow(EmptyCycleNameError);
  });

  it('should reject non-team-member user', async () => {
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);
    const start = futureDate();
    const end = futureDatePlus10();
    await expect(
      createCycle.execute({ teamId: TEAM_ID, name: 'Test', startDate: start, endDate: end }, USER_ID),
    ).rejects.toThrow(NotCycleTeamMemberError);
  });

  it('should reject past start date', async () => {
    await expect(
      createCycle.execute(
        { teamId: TEAM_ID, name: 'Test', startDate: '2020-01-01', endDate: '2020-02-01' },
        USER_ID,
      ),
    ).rejects.toThrow(CyclePastStartDateError);
  });

  it('should reject end date before start date', async () => {
    const start = futureDate();
    const end = futureDate();
    await expect(
      createCycle.execute(
        { teamId: TEAM_ID, name: 'Test', startDate: end, endDate: start },
        USER_ID,
      ),
    ).rejects.toThrow(CycleDateValidationError);
  });

  it('should reject end date equal to start date', async () => {
    const start = futureDate();
    await expect(
      createCycle.execute(
        { teamId: TEAM_ID, name: 'Test', startDate: start, endDate: start },
        USER_ID,
      ),
    ).rejects.toThrow(CycleDateValidationError);
  });

  it('should publish CycleCreated event', async () => {
    const start = futureDate();
    const end = futureDatePlus10();
    mockCycleRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456712',
      teamId: TEAM_ID,
      name: 'Test',
      description: null,
      status: 'draft',
      startDate: start,
      endDate: end,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    });

    await createCycle.execute(
      { teamId: TEAM_ID, name: 'Test', startDate: start, endDate: end },
      USER_ID,
    );

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CycleCreated', userId: USER_ID, cycleId: expect.any(String) }),
    );
  });
});
