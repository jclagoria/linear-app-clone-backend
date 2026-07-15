import { describe, it, expect, vi } from 'vitest';
import { DeleteLabel } from '../application/delete-label';
import { LabelNotFoundError } from '../domain/errors';

const LABEL_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456740';

describe('DeleteLabel', () => {
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

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const useCase = new DeleteLabel(mockLabelRepo, mockEventPublisher);

  it('should delete a label successfully', async () => {
    mockLabelRepo.findById.mockResolvedValue({
      id: LABEL_ID, name: 'Bug', description: null, color: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    });

    await useCase.execute(LABEL_ID, 'user-1');

    expect(mockLabelRepo.softDelete).toHaveBeenCalledWith(LABEL_ID);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'label.deleted' }),
    );
  });

  it('should throw LabelNotFoundError for non-existent label', async () => {
    mockLabelRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(LABEL_ID, 'user-1'),
    ).rejects.toThrow(LabelNotFoundError);
  });
});
