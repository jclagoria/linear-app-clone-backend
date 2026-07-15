import { describe, it, expect, vi } from 'vitest';
import { UpdateLabel } from '../application/update-label';
import { LabelNotFoundError, LabelNameConflictError } from '../domain/errors';

const LABEL_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456730';

describe('UpdateLabel', () => {
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

  const useCase = new UpdateLabel(mockLabelRepo, mockEventPublisher);

  it('should update a label successfully', async () => {
    mockLabelRepo.findById.mockResolvedValue({
      id: LABEL_ID, name: 'Old', description: null, color: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    });
    mockLabelRepo.update.mockResolvedValue({
      id: LABEL_ID, name: 'New', description: null, color: '#00ff00', createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    });

    const result = await useCase.execute(LABEL_ID, { name: 'New', color: '#00ff00' }, 'user-1');

    expect(result.name).toBe('New');
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'label.updated' }),
    );
  });

  it('should throw LabelNotFoundError for non-existent label', async () => {
    mockLabelRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(LABEL_ID, { name: 'New' }, 'user-1'),
    ).rejects.toThrow(LabelNotFoundError);
  });

  it('should throw LabelNameConflictError for duplicate name', async () => {
    mockLabelRepo.findById.mockResolvedValue({
      id: LABEL_ID, name: 'Old', description: null, color: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    });
    mockLabelRepo.findByName.mockResolvedValue({
      id: 'other', name: 'New', description: null, color: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
    });

    await expect(
      useCase.execute(LABEL_ID, { name: 'New' }, 'user-1'),
    ).rejects.toThrow(LabelNameConflictError);
  });
});
