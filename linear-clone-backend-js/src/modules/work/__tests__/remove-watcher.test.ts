import { describe, it, expect, vi } from 'vitest';
import { RemoveWatcher } from '../application/remove-watcher';
import { WatcherNotFoundError } from '../domain/errors';

const ISSUE_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456701';
const USER_ID = 'b1b2c3d4-e5f6-4789-abcd-ef0123456702';

describe('RemoveWatcher', () => {
  const mockWatcherRepo = {
    findByIssueId: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  };

  const mockEventPublisher = { publish: vi.fn() };

  const useCase = new RemoveWatcher(mockWatcherRepo, mockEventPublisher);

  it('should remove a watcher successfully', async () => {
    mockWatcherRepo.findOne.mockResolvedValue({
      id: 'watch-1', issueId: ISSUE_ID, userId: USER_ID, createdAt: new Date(),
    });

    await useCase.execute({ issueId: ISSUE_ID, userId: USER_ID }, 'actor-1');

    expect(mockWatcherRepo.delete).toHaveBeenCalledWith(ISSUE_ID, USER_ID);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'issue.watcher.removed' }),
    );
  });

  it('should throw WatcherNotFoundError for non-existent watcher', async () => {
    mockWatcherRepo.findOne.mockResolvedValue(null);

    await expect(
      useCase.execute({ issueId: ISSUE_ID, userId: USER_ID }, 'actor-1'),
    ).rejects.toThrow(WatcherNotFoundError);
  });
});
