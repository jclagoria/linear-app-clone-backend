import { describe, it, expect, vi } from 'vitest';
import { DetachLabel } from '../application/detach-label';
import { LabelNotFoundError } from '../domain/errors';

const ISSUE_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456701';
const LABEL_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456750';

describe('DetachLabel', () => {
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

  const mockEventPublisher = { publish: vi.fn() };

  const useCase = new DetachLabel(mockLabelRepo, mockEventPublisher);

  it('should detach a label from an issue successfully', async () => {
    mockLabelRepo.findById.mockResolvedValue({ id: LABEL_ID, name: 'Bug', description: null, color: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null });

    await useCase.execute({ issueId: ISSUE_ID, labelId: LABEL_ID }, 'user-1');

    expect(mockLabelRepo.detachFromIssue).toHaveBeenCalledWith(ISSUE_ID, LABEL_ID);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'issue.label.detached' }),
    );
  });

  it('should throw LabelNotFoundError for non-existent label', async () => {
    mockLabelRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ issueId: ISSUE_ID, labelId: LABEL_ID }, 'user-1'),
    ).rejects.toThrow(LabelNotFoundError);
  });
});
