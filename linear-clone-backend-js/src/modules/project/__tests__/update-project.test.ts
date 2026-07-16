import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateProject } from '../application/update-project';
import { ProjectNotFoundError, EmptyProjectNameError, NotProjectTeamMemberError, ProjectDateValidationError } from '../domain/errors';

const PROJECT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';

function makeProject(overrides = {}) {
  return {
    id: PROJECT_ID,
    teamId: TEAM_ID,
    name: 'Original Name',
    description: 'Original description',
    status: 'planned',
    startDate: null,
    targetDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('UpdateProject', () => {
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

  const updateProject = new UpdateProject(mockProjectRepo, mockTeamMemberQuery, mockEventPublisher);

  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectRepo.findById.mockResolvedValue(makeProject());
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
  });

  it('should update project name', async () => {
    mockProjectRepo.update.mockResolvedValue(makeProject({ name: 'Updated Name' }));

    const result = await updateProject.execute(PROJECT_ID, { name: 'Updated Name' }, USER_ID);

    expect(result.name).toBe('Updated Name');
    expect(mockProjectRepo.update).toHaveBeenCalledWith(PROJECT_ID, expect.objectContaining({ name: 'Updated Name' }));
  });

  it('should update project description', async () => {
    mockProjectRepo.update.mockResolvedValue(makeProject({ description: 'New description' }));

    const result = await updateProject.execute(PROJECT_ID, { description: 'New description' }, USER_ID);

    expect(result.description).toBe('New description');
  });

  it('should update project dates', async () => {
    mockProjectRepo.update.mockResolvedValue(makeProject({ startDate: new Date('2026-01-01'), targetDate: new Date('2026-03-01') }));

    const result = await updateProject.execute(
      PROJECT_ID,
      { startDate: '2026-01-01', targetDate: '2026-03-01' },
      USER_ID,
    );

    expect(result.startDate).toBeTruthy();
    expect(result.targetDate).toBeTruthy();
  });

  it('should reject empty name', async () => {
    await expect(
      updateProject.execute(PROJECT_ID, { name: '' }, USER_ID),
    ).rejects.toThrow(EmptyProjectNameError);
  });

  it('should reject non-member user', async () => {
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      updateProject.execute(PROJECT_ID, { name: 'Test' }, USER_ID),
    ).rejects.toThrow(NotProjectTeamMemberError);
  });

  it('should reject project not found', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);

    await expect(
      updateProject.execute(PROJECT_ID, { name: 'Test' }, USER_ID),
    ).rejects.toThrow(ProjectNotFoundError);
  });

  it('should reject target date before start date', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject({ startDate: new Date('2026-01-01') }));

    await expect(
      updateProject.execute(PROJECT_ID, { targetDate: '2025-01-01' }, USER_ID),
    ).rejects.toThrow(ProjectDateValidationError);
  });

  it('should publish ProjectUpdated event', async () => {
    mockProjectRepo.update.mockResolvedValue(makeProject({ name: 'Updated' }));

    await updateProject.execute(PROJECT_ID, { name: 'Updated' }, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'ProjectUpdated' }),
    );
  });
});
