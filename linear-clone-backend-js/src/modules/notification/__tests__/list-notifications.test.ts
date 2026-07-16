import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListNotifications } from '../application/list-notifications';

const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';

function makeNotification(overrides = {}) {
  return {
    id: 'b2c3d4e5-f6a7-4890-bcde-f01234567890',
    userId: USER_ID,
    type: 'issue_assigned',
    title: 'Test notification',
    body: null,
    link: null,
    readAt: null,
    createdAt: new Date('2026-07-16T10:00:00Z'),
    expiresAt: new Date('2026-10-16T10:00:00Z'),
    ...overrides,
  };
}

describe('ListNotifications', () => {
  const mockNotificationRepo = {
    findMany: vi.fn(),
    findByUserAndId: vi.fn(),
    countUnread: vi.fn(),
    create: vi.fn(),
    markRead: vi.fn(),
    markAllRead: vi.fn(),
  };

  const listNotifications = new ListNotifications(mockNotificationRepo);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list notifications with pagination', async () => {
    const notifications = [makeNotification()];
    mockNotificationRepo.findMany.mockResolvedValue({
      data: notifications,
      pagination: { hasMore: false, nextCursor: null },
    });
    mockNotificationRepo.countUnread.mockResolvedValue(5);

    const result = await listNotifications.execute({ limit: 20 }, USER_ID);

    expect(result.data).toHaveLength(1);
    expect(result.unreadCount).toBe(5);
    expect(result.pagination.hasMore).toBe(false);
  });

  it('should include unread count in response', async () => {
    mockNotificationRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { hasMore: false, nextCursor: null },
    });
    mockNotificationRepo.countUnread.mockResolvedValue(3);

    const result = await listNotifications.execute({ limit: 20 }, USER_ID);

    expect(result.unreadCount).toBe(3);
  });

  it('should filter by read status', async () => {
    mockNotificationRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { hasMore: false, nextCursor: null },
    });
    mockNotificationRepo.countUnread.mockResolvedValue(0);

    await listNotifications.execute({ filter: 'unread', limit: 20 }, USER_ID);

    expect(mockNotificationRepo.findMany).toHaveBeenCalledWith(
      USER_ID,
      'unread',
      undefined,
      20,
    );
  });

  it('should sort by created_at descending (newest first)', async () => {
    const oldNotif = makeNotification({
      createdAt: new Date('2026-07-15T10:00:00Z'),
    });
    const newNotif = makeNotification({
      id: 'c3d4e5f6-a7b8-4901-cdef-012345678901',
      createdAt: new Date('2026-07-16T10:00:00Z'),
    });
    mockNotificationRepo.findMany.mockResolvedValue({
      data: [newNotif, oldNotif],
      pagination: { hasMore: false, nextCursor: null },
    });
    mockNotificationRepo.countUnread.mockResolvedValue(2);

    const result = await listNotifications.execute({ limit: 20 }, USER_ID);

    expect(new Date(result.data[0].createdAt) > new Date(result.data[1].createdAt)).toBe(true);
  });

  it('should handle empty notification list', async () => {
    mockNotificationRepo.findMany.mockResolvedValue({
      data: [],
      pagination: { hasMore: false, nextCursor: null },
    });
    mockNotificationRepo.countUnread.mockResolvedValue(0);

    const result = await listNotifications.execute({ limit: 20 }, USER_ID);

    expect(result.data).toHaveLength(0);
    expect(result.unreadCount).toBe(0);
    expect(result.pagination.hasMore).toBe(false);
  });
});
