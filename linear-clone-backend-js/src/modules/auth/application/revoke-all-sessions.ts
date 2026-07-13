import { z } from 'zod';
import { SessionRepository } from './ports/session-repository';
import { EventPublisher } from './ports/event-publisher';

export const RevokeAllSessionsInput = z.object({
  userId: z.string().uuid('Invalid user ID'),
  currentRefreshTokenHash: z.string().min(1, 'Current refresh token hash is required'),
});

export type RevokeAllSessionsInputType = z.infer<typeof RevokeAllSessionsInput>;

export interface RevokeAllSessionsOutput {
  success: true;
  revokedCount: number;
}

export class RevokeAllSessions {
  constructor(
    private sessionRepository: SessionRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: RevokeAllSessionsInputType): Promise<RevokeAllSessionsOutput> {
    const validatedInput = RevokeAllSessionsInput.parse(input);

    const allSessions = await this.sessionRepository.findByUserId(validatedInput.userId);

    const sessionsToRevoke = allSessions.filter(
      (session) => session.refreshTokenHash !== validatedInput.currentRefreshTokenHash,
    );

    if (sessionsToRevoke.length === 0) {
      return { success: true, revokedCount: 0 };
    }

    const sessionIds = sessionsToRevoke.map((s) => s.id);
    await this.sessionRepository.deleteByIds(sessionIds, validatedInput.userId);

    for (const session of sessionsToRevoke) {
      await this.eventPublisher.publish({
        type: 'session_revoked',
        userId: validatedInput.userId,
        sessionId: session.id,
        timestamp: new Date(),
      });
    }

    return { success: true, revokedCount: sessionsToRevoke.length };
  }
}