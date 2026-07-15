import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangeProjectStatus } from '../application/change-project-status';
import {
  ProjectNotFoundError,
  InvalidProjectStatusTransitionError,
  NotProjectTeamMemberError,
  ProjectCancelNotAdminError,
  CannotReopenCompletedProjectError,
} from '../domain/errors';

const PROJECT_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456710';
const TEAM_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456702';
const ISSUE_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456720';

function makeProject(status: string, overrides = {}) {
  return {
    id: PROJECT_ID,
    teamId: TEAM_ID,
    name: 'Test Project',
    description: null,
    status,
    startDate: null,
    targetDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('ChangeProjectStatus', () => {
  const mockProjectRepo = {
    findById: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockTeamMemberQuery = {
    isTeamMember: vi.fn(),
  };

  const mockTeamAdminQuery = {
    isTeamAdmin: vi.fn(),
  };

  const mockIssueUpdateQuery = {
    updateIssueProjectId: vi.fn(),
    getIssuesByProject: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const changeProjectStatus = new ChangeProjectStatus(
    mockProjectRepo,
    mockTeamMemberQuery,
    mockTeamAdminQuery,
    mockIssueUpdateQuery,
    mockEventPublisher,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockIssueUpdateQuery.getIssuesByProject.mockResolvedValue([]);
  });

  it('should transition from planned to in_progress', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('planned'));
    mockProjectRepo.update.mockResolvedValue(makeProject('in_progress'));

    const result = await changeProjectStatus.execute(PROJECT_ID, { status: 'in_progress' }, USER_ID);

    expect(result.status).toBe('in_progress');
  });

  it('should transition from in_progress to completed', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('in_progress'));
    mockProjectRepo.update.mockResolvedValue(makeProject('completed'));

    const result = await changeProjectStatus.execute(PROJECT_ID, { status: 'completed' }, USER_ID);

    expect(result.status).toBe('completed');
  });

  it('should transition from in_progress to canceled (admin)', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('in_progress'));
    mockTeamAdminQuery.isTeamAdmin.mockResolvedValue(true);
    mockProjectRepo.update.mockResolvedValue(makeProject('canceled'));

    const result = await changeProjectStatus.execute(PROJECT_ID, { status: 'canceled' }, USER_ID);

    expect(result.status).toBe('canceled');
  });

  it('should disassociate issues on cancel', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('in_progress'));
    mockTeamAdminQuery.isTeamAdmin.mockResolvedValue(true);
    mockProjectRepo.update.mockResolvedValue(makeProject('canceled'));
    mockIssueUpdateQuery.getIssuesByProject.mockResolvedValue([{ id: ISSUE_ID }]);

    await changeProjectStatus.execute(PROJECT_ID, { status: 'canceled' }, USER_ID);

    expect(mockIssueUpdateQuery.updateIssueProjectId).toHaveBeenCalledWith(ISSUE_ID, null);
  });

  it('should reject non-member user', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('planned'));
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(false);

    await expect(
      changeProjectStatus.execute(PROJECT_ID, { status: 'in_progress' }, USER_ID),
    ).rejects.toThrow(NotProjectTeamMemberError);
  });

  it('should reject non-admin cancel', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('in_progress'));
    mockTeamAdminQuery.isTeamAdmin.mockResolvedValue(false);

    await expect(
      changeProjectStatus.execute(PROJECT_ID, { status: 'canceled' }, USER_ID),
    ).rejects.toThrow(ProjectCancelNotAdminError);
  });

  it('should reject reopening completed project', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('completed'));

    await expect(
      changeProjectStatus.execute(PROJECT_ID, { status: 'in_progress' }, USER_ID),
    ).rejects.toThrow(CannotReopenCompletedProjectError);
  });

  it('should reject invalid transition planned to completed', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('planned'));

    await expect(
      changeProjectStatus.execute(PROJECT_ID, { status: 'completed' }, USER_ID),
    ).rejects.toThrow(InvalidProjectStatusTransitionError);
  });

  it('should reject invalid transition planned to canceled', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('planned'));

    await expect(
      changeProjectStatus.execute(PROJECT_ID, { status: 'canceled' }, USER_ID),
    ).rejects.toThrow(InvalidProjectStatusTransitionError);
  });

  it('should reject when project not found', async () => {
    mockProjectRepo.findById.mockResolvedValue(null);

    await expect(
      changeProjectStatus.execute(PROJECT_ID, { status: 'in_progress' }, USER_ID),
    ).rejects.toThrow(ProjectNotFoundError);
  });

  it('should publish ProjectStatusChanged event', async () => {
    mockProjectRepo.findById.mockResolvedValue(makeProject('planned'));
    mockProjectRepo.update.mockResolvedValue(makeProject('in_progress'));

    await changeProjectStatus.execute(PROJECT_ID, { status: 'in_progress' }, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ProjectStatusChanged',
        oldStatus: 'planned',
        newStatus: 'in_progress',
      }),
    );
  });
});
