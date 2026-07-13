import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogoutUser } from '../application/logout-user';
import { SessionRepository } from '../application/ports/session-repository';
import { EventPublisher } from '../application/ports/event-publisher';

describe('LogoutUser', () => {
  let logoutUser: LogoutUser;
  let mockSessionRepository: SessionRepository;
  let mockEventPublisher: EventPublisher;

  const validUserId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    mockSessionRepository = {
      create: vi.fn(),
      findByRefreshTokenHash: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      deleteById: vi.fn(),
      deleteByIds: vi.fn(),
      findOldestByUserId: vi.fn(),
      deleteByRefreshTokenHash: vi.fn(),
      countByUserId: vi.fn(),
      deleteOldestByUserId: vi.fn(),
      deleteExpired: vi.fn(),
    };

    mockEventPublisher = {
      publish: vi.fn(),
    };

    logoutUser = new LogoutUser(mockSessionRepository, mockEventPublisher);
  });

  it('should logout successfully and delete sessions', async () => {
    vi.mocked(mockSessionRepository.countByUserId).mockResolvedValue(2);
    vi.mocked(mockSessionRepository.deleteOldestByUserId).mockResolvedValue();
    vi.mocked(mockEventPublisher.publish).mockResolvedValue();

    const result = await logoutUser.execute({ userId: validUserId });

    expect(result.success).toBe(true);
    expect(mockSessionRepository.countByUserId).toHaveBeenCalledWith(validUserId);
    expect(mockSessionRepository.deleteOldestByUserId).toHaveBeenCalledWith(validUserId, 2);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith({
      type: 'UserLoggedOut',
      userId: validUserId,
      timestamp: expect.any(Date),
    });
  });

  it('should be idempotent when no sessions exist', async () => {
    vi.mocked(mockSessionRepository.countByUserId).mockResolvedValue(0);
    vi.mocked(mockEventPublisher.publish).mockResolvedValue();

    const result = await logoutUser.execute({ userId: validUserId });

    expect(result.success).toBe(true);
    expect(mockSessionRepository.countByUserId).toHaveBeenCalledWith(validUserId);
    expect(mockSessionRepository.deleteOldestByUserId).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).toHaveBeenCalled();
  });
});
