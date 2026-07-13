import { z } from 'zod';
import bcrypt from 'bcrypt';
import { UserRepository } from './ports/user-repository';
import { SessionRepository } from './ports/session-repository';
import { TokenService } from './ports/token-service';
import { EventPublisher } from './ports/event-publisher';
import { env } from '../../../shared/config/env';
import { hashToken } from '../../../shared/utils/crypto';

export const LoginUserInput = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
  ipAddress: z.string().min(1, 'IP address is required'),
  userAgent: z.string().min(1, 'User agent is required'),
});

export type LoginUserInputType = z.infer<typeof LoginUserInput>;

export interface LoginUserOutput {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private tokenService: TokenService,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: LoginUserInputType): Promise<LoginUserOutput> {
    // Validate input
    const validatedInput = LoginUserInput.parse(input);

    // Find user by email
    const user = await this.userRepository.findByEmail(validatedInput.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(validatedInput.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check session limit and evict oldest if needed
    const sessionCount = await this.sessionRepository.countByUserId(user.id);
    if (sessionCount >= env.SESSION_LIMIT) {
      const oldestSession = await this.sessionRepository.findOldestByUserId(user.id);
      if (oldestSession) {
        await this.sessionRepository.deleteById(oldestSession.id, user.id);
        await this.eventPublisher.publish({
          type: 'session_evicted',
          userId: user.id,
          sessionId: oldestSession.id,
          reason: 'limit_exceeded',
          timestamp: new Date(),
        });
      }
    }

    // Generate refresh token
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    // Hash refresh token for storage (SHA-256 for deterministic lookups)
    const refreshTokenHash = hashToken(refreshToken);

    // Calculate expiry
    const expiresAt = new Date();
    if (validatedInput.rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    } else {
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
    }

    // Create session first to get session ID
    const session = await this.sessionRepository.create({
      userId: user.id,
      refreshTokenHash,
      ipAddress: validatedInput.ipAddress,
      userAgent: validatedInput.userAgent,
      rememberMe: validatedInput.rememberMe,
      expiresAt,
    });

    // Generate access token with session ID
    const accessToken = await this.tokenService.generateAccessToken(user.id, session.id);

    // Emit event
    await this.eventPublisher.publish({
      type: 'UserLoggedIn',
      userId: user.id,
      timestamp: new Date(),
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
