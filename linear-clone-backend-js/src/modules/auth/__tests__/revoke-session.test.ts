import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RevokeSession, NotFoundError } from '../application/revoke-session';
import { SessionRepository } from '../application/ports/session-repository';
import { EventPublisher } from '../application/ports/event-publisher';

describe('RevokeSession', () => {
  let revokeSession: RevokeSession;
  let mockSessionRepository: SessionRepository;
  let mockEventPublisher: EventPublisher;

  const validUserId = '123e4567-e89b-12d3-a456-426614174000';
  const validSessionId = '111e4567-e89b-12d3-a456-426614174000';

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

    revokeSession = new RevokeSession(mockSessionRepository, mockEventPublisher);
  });

  it('should delete session and emit event', async () => {
    const session = {
      id: validSessionId,
      userId: validUserId,
      refreshTokenHash: 'hash',
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
      rememberMe: false,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
    };

    vi.mocked(mockSessionRepository.findById).mockResolvedValue(session);
    vi.mocked(mockSessionRepository.deleteById).mockResolvedValue();
    vi.mocked(mockEventPublisher.publish).mockResolvedValue();

    const result = await revokeSession.execute({
      userId: validUserId,
      sessionId: validSessionId,
    });

    expect(result).toEqual({ success: true });
    expect(mockSessionRepository.findById).toHaveBeenCalledWith(validSessionId, validUserId);
    expect(mockSessionRepository.deleteById).toHaveBeenCalledWith(validSessionId, validUserId);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith({
      type: 'session_revoked',
      userId: validUserId,
      sessionId: validSessionId,
      timestamp: expect.any(Date),
    });
  });

  it('should throw NotFoundError for non-existent session', async () => {
    vi.mocked(mockSessionRepository.findById).mockResolvedValue(null);

    await expect(
      revokeSession.execute({
        userId: validUserId,
        sessionId: validSessionId,
      }),
    ).rejects.toThrow(NotFoundError);

    expect(mockSessionRepository.deleteById).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError for session belonging to another user', async () => {
    const otherUserId = '222e4567-e89b-12d3-a456-426614174001';
    vi.mocked(mockSessionRepository.findById).mockResolvedValue(null);

    await expect(
      revokeSession.execute({
        userId: otherUserId,
        sessionId: validSessionId,
      }),
    ).rejects.toThrow(NotFoundError);
  });
});