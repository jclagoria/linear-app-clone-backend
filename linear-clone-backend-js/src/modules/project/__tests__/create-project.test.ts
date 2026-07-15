import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProject } from '../application/create-project';
import { EmptyProjectNameError, NotProjectTeamMemberError, ProjectDateValidationError } from '../domain/errors';

const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

describe('CreateProject', () => {
  const mockProjectRepo = {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockTeamMemberQuery = {
    isTeamMember: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const createProject = new CreateProject(mockProjectRepo, mockTeamMemberQuery, mockEventPublisher);

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should create a project with minimal fields', async () => {
    mockProjectRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456710',
      teamId: TEAM_ID,
      name: 'Sprint 24',
      description: null,
      status: 'planned',
      startDate: null,
      targetDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createProject.execute(
      { teamId: TEAM_ID, name: 'Sprint 24' },
      USER_ID,
    );

    expect(result.name).toBe('Sprint 24');
    expect(result.status).toBe('planned');
    expect(mockProjectRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Sprint 24', status: 'planned' }),
    );
  });

  it('should create a project with all fields', async () => {
    mockProjectRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456711',
      teamId: TEAM_ID,
      name: 'Q4 Release',
      description: 'Q4 planning and execution',
      status: 'planned',
      startDate: new Date('2026-01-01'),
      targetDate: new Date('2026-03-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createProject.execute(
      {
        teamId: TEAM_ID,
        name: 'Q4 Release',
        description: 'Q4 planning and execution',
        startDate: '2026-01-01',
        targetDate: '2026-03-01',
      },
      USER_ID,
    );

    expect(result.name).toBe('Q4 Release');
    expect(result.description).toBe('Q4 planning and execution');
    expect(result.status).toBe('planned');
  });

  it('should reject empty name', async () => {
    await expect(
      createProject.execute({ teamId: TEAM_ID, name: '' }, USER_ID),
    ).rejects.toThrow(EmptyProjectNameError);
  });

  it('should reject name with only whitespace', async () => {
    await expect(
      createProject.execute({ teamId: TEAM_ID, name: '   ' }, USER_ID),
    ).rejects.toThrow(EmptyProjectNameError);
  });

  it('should reject non-team-member user', async () => {
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      createProject.execute({ teamId: TEAM_ID, name: 'Test' }, USER_ID),
    ).rejects.toThrow(NotProjectTeamMemberError);
  });

  it('should reject target date before start date', async () => {
    await expect(
      createProject.execute(
        { teamId: TEAM_ID, name: 'Test', startDate: '2026-03-01', targetDate: '2026-01-01' },
        USER_ID,
      ),
    ).rejects.toThrow(ProjectDateValidationError);
  });

  it('should reject target date equal to start date', async () => {
    await expect(
      createProject.execute(
        { teamId: TEAM_ID, name: 'Test', startDate: '2026-01-01', targetDate: '2026-01-01' },
        USER_ID,
      ),
    ).rejects.toThrow(ProjectDateValidationError);
  });

  it('should publish ProjectCreated event', async () => {
    mockProjectRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456712',
      teamId: TEAM_ID,
      name: 'Test',
      description: null,
      status: 'planned',
      startDate: null,
      targetDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createProject.execute({ teamId: TEAM_ID, name: 'Test' }, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'ProjectCreated', userId: USER_ID, projectId: expect.any(String) }),
    );
  });

  it('should accept dates without target date', async () => {
    mockProjectRepo.create.mockResolvedValue({
      id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456713',
      teamId: TEAM_ID,
      name: 'Test',
      description: null,
      status: 'planned',
      startDate: new Date('2026-01-01'),
      targetDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createProject.execute(
      { teamId: TEAM_ID, name: 'Test', startDate: '2026-01-01' },
      USER_ID,
    );

    expect(result.status).toBe('planned');
  });
});
