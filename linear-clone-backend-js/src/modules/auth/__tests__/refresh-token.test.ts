import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RefreshToken, TokenExpiredError, TokenRevokedError } from '../application/refresh-token';
import { SessionRepository } from '../application/ports/session-repository';
import { TokenService } from '../application/ports/token-service';

describe('RefreshToken', () => {
  let refreshToken: RefreshToken;
  let mockSessionRepository: SessionRepository;
  let mockTokenService: TokenService;

  beforeEach(() => {
    mockSessionRepository = {
      create: vi.fn(),
      findByRefreshTokenHash: vi.fn(),
      deleteByRefreshTokenHash: vi.fn(),
      countByUserId: vi.fn(),
      deleteOldestByUserId: vi.fn(),
      deleteExpired: vi.fn(),
    };

    mockTokenService = {
      generateAccessToken: vi.fn(),
      generateRefreshToken: vi.fn(),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
    };

    refreshToken = new RefreshToken(mockSessionRepository, mockTokenService);
  });

  it('should refresh token successfully', async () => {
    const oldRefreshToken = 'old-refresh-token';
    const newAccessToken = 'new-access-token';
    const newRefreshToken = 'new-refresh-token';

    vi.mocked(mockTokenService.verifyRefreshToken).mockResolvedValue({
      valid: true,
      userId: 'user-id-123',
      jti: 'jti-123',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    vi.mocked(mockSessionRepository.findByRefreshTokenHash).mockResolvedValue({
      id: 'session-id-123',
      userId: 'user-id-123',
      refreshTokenHash: 'old-hash',
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      rememberMe: false,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    vi.mocked(mockTokenService.generateAccessToken).mockResolvedValue(newAccessToken);
    vi.mocked(mockTokenService.generateRefreshToken).mockResolvedValue(newRefreshToken);
    vi.mocked(mockSessionRepository.deleteByRefreshTokenHash).mockResolvedValue();
    vi.mocked(mockSessionRepository.create).mockResolvedValue({
      id: 'new-session-id',
      userId: 'user-id-123',
      refreshTokenHash: 'new-hash',
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
      rememberMe: false,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const result = await refreshToken.execute({ refreshToken: oldRefreshToken });

    expect(result.accessToken).toBe(newAccessToken);
    expect(result.refreshToken).toBe(newRefreshToken);
    expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(oldRefreshToken);
    expect(mockSessionRepository.deleteByRefreshTokenHash).toHaveBeenCalled();
    expect(mockSessionRepository.create).toHaveBeenCalled();
  });

  it('should throw TokenExpiredError for invalid token', async () => {
    vi.mocked(mockTokenService.verifyRefreshToken).mockResolvedValue({
      valid: false,
    });

    await expect(refreshToken.execute({ refreshToken: 'invalid-token' })).rejects.toThrow(
      TokenExpiredError,
    );
  });

  it('should throw TokenRevokedError for revoked token', async () => {
    vi.mocked(mockTokenService.verifyRefreshToken).mockResolvedValue({
      valid: true,
      userId: 'user-id-123',
      jti: 'jti-123',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    vi.mocked(mockSessionRepository.findByRefreshTokenHash).mockResolvedValue(null);

    await expect(refreshToken.execute({ refreshToken: 'revoked-token' })).rejects.toThrow(
      TokenRevokedError,
    );
  });
});
