import { z } from 'zod';
import bcrypt from 'bcrypt';
import { SessionRepository } from './ports/session-repository';
import { TokenService } from './ports/token-service';
import { env } from '../../../shared/config/env';

export const RefreshTokenInput = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInputType = z.infer<typeof RefreshTokenInput>;

export interface RefreshTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export class RefreshToken {
  constructor(
    private sessionRepository: SessionRepository,
    private tokenService: TokenService,
  ) {}

  async execute(input: RefreshTokenInputType): Promise<RefreshTokenOutput> {
    const validatedInput = RefreshTokenInput.parse(input);

    // Verify refresh token signature and type
    const tokenResult = await this.tokenService.verifyRefreshToken(validatedInput.refreshToken);

    if (!tokenResult.valid) {
      throw new TokenExpiredError('Refresh token is invalid or expired');
    }

    // Find session by refresh token hash
    const session = await this.sessionRepository.findByRefreshTokenHash(
      await bcrypt.hash(validatedInput.refreshToken, 10),
    );

    if (!session) {
      // Token not found or already revoked — possible reuse attempt
      throw new TokenRevokedError('Refresh token has been revoked or already used');
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      // Delete expired session
      await this.sessionRepository.deleteByRefreshTokenHash(session.refreshTokenHash);
      throw new TokenExpiredError('Refresh token has expired');
    }

    // Generate new tokens
    const newAccessToken = await this.tokenService.generateAccessToken(session.userId);
    const newRefreshToken = await this.tokenService.generateRefreshToken(session.userId);

    // Hash new refresh token
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    // Delete old session
    await this.sessionRepository.deleteByRefreshTokenHash(session.refreshTokenHash);

    // Create new session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.sessionRepository.create({
      userId: session.userId,
      refreshTokenHash: newRefreshTokenHash,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      rememberMe: session.rememberMe,
      expiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class TokenRevokedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenRevokedError';
  }
}
