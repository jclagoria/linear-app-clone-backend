import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateNotification } from '../application/create-notification';
import { InvalidNotificationTypeError } from '../domain/errors';

const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';
const NOTIFICATION_ID = 'b2c3d4e5-f6a7-4890-bcde-f01234567890';

function makeInsertResult(overrides = {}) {
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

describe('CreateNotification', () => {
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

  const createNotification = new CreateNotification(
    mockNotificationRepo,
    mockEventPublisher,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a notification with correct expiry date', async () => {
    const now = new Date();
    const inserted = makeInsertResult({
      createdAt: now,
      expiresAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      body: 'You have been assigned to Fix login bug',
      link: '/issues/ENG-123',
      title: 'Test notification',
    });
    mockNotificationRepo.create.mockResolvedValue(inserted);

    const result = await createNotification.execute({
      userId: USER_ID,
      type: 'issue_assigned',
      title: 'You were assigned to ENG-123',
      body: 'You have been assigned to Fix login bug',
      link: '/issues/ENG-123',
    });

    expect(result.title).toBe('Test notification');
    expect(result.type).toBe('issue_assigned');
    expect(result.body).toBe('You have been assigned to Fix login bug');
    expect(result.link).toBe('/issues/ENG-123');
    expect(mockNotificationRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should publish NotificationCreated event', async () => {
    mockNotificationRepo.create.mockResolvedValue(makeInsertResult());

    await createNotification.execute({
      userId: USER_ID,
      type: 'issue_assigned',
      title: 'Test',
    });

    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'NotificationCreated',
        userId: USER_ID,
      }),
    );
  });

  it('should validate notification type', async () => {
    mockNotificationRepo.create.mockResolvedValue(makeInsertResult());

    await expect(
      createNotification.execute({
        userId: USER_ID,
        type: 'invalid_type' as any,
        title: 'Test',
      }),
    ).rejects.toThrow();
  });

  it('should set expires_at to 90 days from now', async () => {
    const now = new Date();
    const expectedExpiry = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    const inserted = makeInsertResult({ createdAt: now, expiresAt: expectedExpiry });
    mockNotificationRepo.create.mockResolvedValue(inserted);

    const result = await createNotification.execute({
      userId: USER_ID,
      type: 'issue_assigned',
      title: 'Test',
    });

    expect(new Date(result.expiresAt).getTime()).toBeCloseTo(
      expectedExpiry.getTime(),
      -2,
    );
  });
});
