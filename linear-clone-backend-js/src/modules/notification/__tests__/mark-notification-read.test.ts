import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarkNotificationRead } from '../application/mark-notification-read';
import { NotificationNotFoundError, NotificationNotOwnerError } from '../domain/errors';

const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const OTHER_USER_ID = 'f6a7b8c9-d0e1-4234-afcd-ef0123456799';
const NOTIFICATION_ID = 'b2c3d4e5-f6a7-4890-bcde-f01234567890';

function makeNotification(overrides = {}) {
  return {
    id: NOTIFICATION_ID,
    userId: USER_ID,
    type: 'issue_assigned',
    title: 'Test notification',
    body: null,
    link: null,
    readAt: null,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    ...overrides,
  };
}

describe('MarkNotificationRead', () => {
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

  const markNotificationRead = new MarkNotificationRead(
    mockNotificationRepo,
    mockEventPublisher,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should mark a notification as read', async () => {
    mockNotificationRepo.findByUserAndId.mockResolvedValue(makeNotification());
    mockNotificationRepo.markRead.mockResolvedValue(makeNotification({ readAt: new Date() }));

    const result = await markNotificationRead.execute(
      { id: NOTIFICATION_ID },
      USER_ID,
    );

    expect(result.success).toBe(true);
    expect(mockNotificationRepo.markRead).toHaveBeenCalledWith(NOTIFICATION_ID);
  });

  it('should be idempotent when already read', async () => {
    mockNotificationRepo.findByUserAndId.mockResolvedValue(
      makeNotification({ readAt: new Date() }),
    );

    const result = await markNotificationRead.execute(
      { id: NOTIFICATION_ID },
      USER_ID,
    );

    expect(result.success).toBe(true);
    expect(mockNotificationRepo.markRead).not.toHaveBeenCalled();
  });

  it('should reject notification not owned by user', async () => {
    mockNotificationRepo.findByUserAndId.mockResolvedValue(
      makeNotification({ userId: OTHER_USER_ID }),
    );

    await expect(
      markNotificationRead.execute({ id: NOTIFICATION_ID }, USER_ID),
    ).rejects.toThrow(NotificationNotOwnerError);
  });

  it('should reject non-existent notification', async () => {
    mockNotificationRepo.findByUserAndId.mockResolvedValue(null);

    await expect(
      markNotificationRead.execute({ id: NOTIFICATION_ID }, USER_ID),
    ).rejects.toThrow(NotificationNotFoundError);
  });

  it('should publish NotificationRead event', async () => {
    mockNotificationRepo.findByUserAndId.mockResolvedValue(makeNotification());
    mockNotificationRepo.markRead.mockResolvedValue(makeNotification({ readAt: new Date() }));

    await markNotificationRead.execute({ id: NOTIFICATION_ID }, USER_ID);

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'NotificationRead',
        userId: USER_ID,
      }),
    );
  });
});
