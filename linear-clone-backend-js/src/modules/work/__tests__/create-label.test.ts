import { describe, it, expect, vi } from 'vitest';
import { CreateLabel } from '../application/create-label';
import { LabelNameConflictError } from '../domain/errors';

describe('CreateLabel', () => {
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

  const useCase = new CreateLabel(mockLabelRepo, mockEventPublisher);

  it('should create a label successfully', async () => {
    mockLabelRepo.findByName.mockResolvedValue(null);
    mockLabelRepo.create.mockResolvedValue({
      id: 'label-1',
      name: 'Bug',
      description: null,
      color: '#ff0000',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await useCase.execute({ name: 'Bug', color: '#ff0000' }, 'user-1');

    expect(result.name).toBe('Bug');
    expect(mockLabelRepo.create).toHaveBeenCalledWith({
      name: 'Bug',
      description: null,
      color: '#ff0000',
    });
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'label.created' }),
    );
  });

  it('should throw LabelNameConflictError for duplicate name', async () => {
    mockLabelRepo.findByName.mockResolvedValue({
      id: 'existing',
      name: 'Bug',
      description: null,
      color: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await expect(
      useCase.execute({ name: 'Bug' }, 'user-1'),
    ).rejects.toThrow(LabelNameConflictError);
  });
});
