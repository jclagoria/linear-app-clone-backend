import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarkAllNotificationsRead } from '../application/mark-all-notifications-read';

const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';

describe('MarkAllNotificationsRead', () => {
  const mockNotificationRepo = {
    findMany: vi.fn(),
    findByUserAndId: vi.fn(),
    countUnread: vi.fn(),
    create: vi.fn(),
    markRead: vi.fn(),
    markAllRead: vi.fn(),
  };

  const mockEventPublisher = {
    publish: vi.fn(),
  };

  const markAllNotificationsRead = new MarkAllNotificationsRead(
    mockNotificationRepo,
    mockEventPublisher,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should mark all notifications as read and return count', async () => {
    mockNotificationRepo.markAllRead.mockResolvedValue(10);

    const result = await markAllNotificationsRead.execute(USER_ID);

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBe(10);
  });

  it('should return 0 when no unread notifications exist', async () => {
    mockNotificationRepo.markAllRead.mockResolvedValue(0);

    const result = await markAllNotificationsRead.execute(USER_ID);

    expect(result.success).toBe(true);
    expect(result.updatedCount).toBe(0);
  });

  it('should publish NotificationRead event when notifications were updated', async () => {
    mockNotificationRepo.markAllRead.mockResolvedValue(5);

    await markAllNotificationsRead.execute(USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'NotificationRead',
        userId: USER_ID,
      }),
    );
  });

  it('should not publish event when no notifications updated', async () => {
    mockNotificationRepo.markAllRead.mockResolvedValue(0);

    await markAllNotificationsRead.execute(USER_ID);

    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it('should only affect the authenticated user', async () => {
    mockNotificationRepo.markAllRead.mockResolvedValue(3);

    await markAllNotificationsRead.execute(USER_ID);

    expect(mockNotificationRepo.markAllRead).toHaveBeenCalledWith(USER_ID);
  });
});
