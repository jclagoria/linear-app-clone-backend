import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListSessions } from '../application/list-sessions';
import { SessionRepository } from '../application/ports/session-repository';

describe('ListSessions', () => {
  let listSessions: ListSessions;
  let mockSessionRepository: SessionRepository;

  const validUserId = '123e4567-e89b-12d3-a456-426614174000';
  const currentRefreshTokenHash = 'current-hash';
  const otherRefreshTokenHash = 'other-hash';

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

    listSessions = new ListSessions(mockSessionRepository);
  });

  it('should return sorted sessions with isCurrent flag', async () => {
    const now = new Date();
    // session1 has more recent lastActivityAt (now - 1000ms)
    const session1 = {
      id: '111e4567-e89b-12d3-a456-426614174000',
      userId: validUserId,
      refreshTokenHash: currentRefreshTokenHash,
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
      rememberMe: false,
      createdAt: new Date(now.getTime() - 10000),
      lastActivityAt: new Date(now.getTime() - 1000),
      expiresAt: new Date(now.getTime() + 86400000),
    };
    // session2 has older lastActivityAt (now - 5000ms)
    const session2 = {
      id: '222e4567-e89b-12d3-a456-426614174001',
      userId: validUserId,
      refreshTokenHash: otherRefreshTokenHash,
      ipAddress: '10.0.0.1',
      userAgent: 'Firefox',
      rememberMe: true,
      createdAt: new Date(now.getTime() - 20000),
      lastActivityAt: new Date(now.getTime() - 5000),
      expiresAt: new Date(now.getTime() + 86400000),
    };

    // Repository returns sessions sorted by lastActivityAt DESC
    vi.mocked(mockSessionRepository.findByUserId).mockResolvedValue([session1, session2]);

    const result = await listSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash,
    });

    expect(result.sessions).toHaveLength(2);
    // Should be sorted by lastActivityAt DESC (most recent first)
    expect(result.sessions[0].id).toBe(session1.id);
    expect(result.sessions[1].id).toBe(session2.id);
    // Current session should be marked
    expect(result.sessions[0].isCurrent).toBe(true);
    expect(result.sessions[1].isCurrent).toBe(false);
  });

  it('should exclude expired sessions', async () => {
    const now = new Date();
    const activeSession = {
      id: '111e4567-e89b-12d3-a456-426614174000',
      userId: validUserId,
      refreshTokenHash: currentRefreshTokenHash,
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
      rememberMe: false,
      createdAt: new Date(now.getTime() - 10000),
      lastActivityAt: new Date(now.getTime() - 1000),
      expiresAt: new Date(now.getTime() + 86400000),
    };
    const expiredSession = {
      id: '222e4567-e89b-12d3-a456-426614174001',
      userId: validUserId,
      refreshTokenHash: otherRefreshTokenHash,
      ipAddress: '10.0.0.1',
      userAgent: 'Firefox',
      rememberMe: true,
      createdAt: new Date(now.getTime() - 20000),
      lastActivityAt: new Date(now.getTime() - 5000),
      expiresAt: new Date(now.getTime() - 1000), // Expired
    };

    vi.mocked(mockSessionRepository.findByUserId).mockResolvedValue([activeSession]); // Only active sessions returned

    const result = await listSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash,
    });

    expect(result.sessions).toHaveLength(1);
    expect(result.sessions[0].id).toBe(activeSession.id);
  });

  it('should handle single session', async () => {
    const now = new Date();
    const session = {
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

    vi.mocked(mockSessionRepository.findByUserId).mockResolvedValue([session]);

    const result = await listSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash,
    });

    expect(result.sessions).toHaveLength(1);
    expect(result.sessions[0].isCurrent).toBe(true);
  });

  it('should mark no session as current when hash is empty', async () => {
    const now = new Date();
    const session = {
      id: '111e4567-e89b-12d3-a456-426614174000',
      userId: validUserId,
      refreshTokenHash: 'some-hash',
      ipAddress: '192.168.1.1',
      userAgent: 'Chrome',
      rememberMe: false,
      createdAt: now,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + 86400000),
    };

    vi.mocked(mockSessionRepository.findByUserId).mockResolvedValue([session]);

    const result = await listSessions.execute({
      userId: validUserId,
      currentRefreshTokenHash: '',
    });

    expect(result.sessions[0].isCurrent).toBe(false);
  });
});