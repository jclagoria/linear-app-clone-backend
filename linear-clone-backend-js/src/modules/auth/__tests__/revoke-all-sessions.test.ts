import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RevokeAllSessions } from '../application/revoke-all-sessions';
import { SessionRepository } from '../application/ports/session-repository';
import { EventPublisher } from '../application/ports/event-publisher';

describe('RevokeAllSessions', () => {
  let revokeAllSessions: RevokeAllSessions;
  let mockSessionRepository: SessionRepository;
  let mockEventPublisher: EventPublisher;

  const validUserId = '123e4567-e89b-12d3-a456-426614174000';
  const currentRefreshTokenHash = 'current-hash';

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

    revokeAllSessions = new RevokeAllSessions(mockSessionRepository, mockEventPublisher);
  });

  it('should revoke all other sessions and return count', async () => {
    const now = new Date();
    const currentSession = {
      id: '111e4567-e89b-12d3-a456-426614174000',
      userId: validUserId,
      refreshTokenHash: currentRefreshTokenHash,
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
      rememberMe: false,
      createdAt: now,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + 86400000),
    };
    const otherSession1 = {
      id: '222e4567-e89b-12d3-a456-426614174001',
      userId: validUserId,
      refreshTokenHash: 'other-hash-1',
      ipAddress: '10.0.0.1',
      userAgent: 'Firefox',
      rememberMe: true,
      createdAt: new Date(now.getTime() - 10000),
      lastActivityAt: new Date(now.getTime() - 5000),
      expiresAt: new Date(now.getTime() + 86400000),
    };
    const otherSession2 = {
      id: '333e4567-e89b-12d3-a456-426614174002',
      userId: validUserId,
      refreshTokenHash: 'other-hash-2',
      ipAddress: '172.16.0.1',
      userAgent: 'Safari',
      rememberMe: false,
      createdAt: new Date(now.getTime() - 20000),
      lastActivityAt: new Date(now.getTime() - 10000),
      expiresAt: new Date(now.getTime() + 86400000),
    };

    vi.mocked(mockSessionRepository.findByUserId).mockResolvedValue([
      currentSession,
      otherSession1,
      otherSession2,
    ]);
    vi.mocked(mockSessionRepository.deleteByIds).mockResolvedValue();
    vi.mocked(mockEventPublisher.publish).mockResolvedValue();

    const result = await revokeAllSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash,
    });

    expect(result).toEqual({ success: true, revokedCount: 2 });
    expect(mockSessionRepository.deleteByIds).toHaveBeenCalledWith(
      [otherSession1.id, otherSession2.id],
      validUserId,
    );
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(2);
  });

  it('should return 0 when only current session exists', async () => {
    const now = new Date();
    const currentSession = {
      id: '111e4567-e89b-12d3-a456-426614174000',
      userId: validUserId,
      refreshTokenHash: currentRefreshTokenHash,
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
      rememberMe: false,
      createdAt: now,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + 86400000),
    };

    vi.mocked(mockSessionRepository.findByUserId).mockResolvedValue([currentSession]);

    const result = await revokeAllSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash,
    });

    expect(result).toEqual({ success: true, revokedCount: 0 });
    expect(mockSessionRepository.deleteByIds).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it('should be idempotent when called multiple times', async () => {
    const now = new Date();
    const currentSession = {
      id: '111e4567-e89b-12d3-a456-426614174000',
      userId: validUserId,
      refreshTokenHash: currentRefreshTokenHash,
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
      rememberMe: false,
      createdAt: now,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + 86400000),
    };

    vi.mocked(mockSessionRepository.findByUserId).mockResolvedValue([currentSession]);

    // First call
    await revokeAllSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash,
    });

    // Second call
    const result = await revokeAllSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash,
    });

    expect(result).toEqual({ success: true, revokedCount: 0 });
  });
});