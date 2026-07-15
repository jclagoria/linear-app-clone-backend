import { describe, it, expect, vi } from 'vitest';
import { AttachLabel } from '../application/attach-label';
import { LabelNotFoundError, LabelAlreadyAttachedError } from '../domain/errors';

const ISSUE_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456701';
const LABEL_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456750';
const USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456702';
const TEAM_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456703';

describe('AttachLabel', () => {
  const mockLabelRepo = {
    findById: vi.fn(),
    findByName: vi.fn(),
    findAll: vi.fn(),
    findByIssueId: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    attachToIssue: vi.fn(),
    detachFromIssue: vi.fn(),
    isAttached: vi.fn(),
  };

  const mockTeamMemberQuery = { isTeamMember: vi.fn() };
  const mockIssueTeamQuery = { getIssueTeamId: vi.fn() };
  const mockEventPublisher = { publish: vi.fn() };

  const useCase = new AttachLabel(
    mockLabelRepo, mockTeamMemberQuery, mockIssueTeamQuery, mockEventPublisher,
  );

  it('should attach a label to an issue successfully', async () => {
    mockLabelRepo.findById.mockResolvedValue({ id: LABEL_ID, name: 'Bug', description: null, color: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null });
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockLabelRepo.isAttached.mockResolvedValue(false);
    mockLabelRepo.attachToIssue.mockResolvedValue({ id: 'link-1', issueId: ISSUE_ID, labelId: LABEL_ID, createdAt: new Date() });

    const result = await useCase.execute({ issueId: ISSUE_ID, labelId: LABEL_ID }, USER_ID);

    expect(result.issueId).toBe(ISSUE_ID);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'issue.label.attached' }),
    );
  });

  it('should throw LabelNotFoundError for non-existent label', async () => {
    mockLabelRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ issueId: ISSUE_ID, labelId: LABEL_ID }, USER_ID),
    ).rejects.toThrow(LabelNotFoundError);
  });

  it('should throw LabelAlreadyAttachedError for duplicate attachment', async () => {
    mockLabelRepo.findById.mockResolvedValue({ id: LABEL_ID, name: 'Bug', description: null, color: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null });
    mockIssueTeamQuery.getIssueTeamId.mockResolvedValue(TEAM_ID);
    mockTeamMemberQuery.isTeamMember.mockResolvedValue(true);
    mockLabelRepo.isAttached.mockResolvedValue(true);

    await expect(
      useCase.execute({ issueId: ISSUE_ID, labelId: LABEL_ID }, USER_ID),
    ).rejects.toThrow(LabelAlreadyAttachedError);
  });
});
