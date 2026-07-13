import { z } from 'zod';
import { SessionRepository } from './ports/session-repository';
import { EventPublisher } from './ports/event-publisher';

export const RevokeSessionInput = z.object({
  userId: z.string().uuid('Invalid user ID'),
  sessionId: z.string().uuid('Invalid session ID'),
});

export type RevokeSessionInputType = z.infer<typeof RevokeSessionInput>;

export class RevokeSession {
  constructor(
    private sessionRepository: SessionRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: RevokeSessionInputType): Promise<{ success: true }> {
    const validatedInput = RevokeSessionInput.parse(input);

    // Find session to verify ownership
    const session = await this.sessionRepository.findById(validatedInput.sessionId, validatedInput.userId);
    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Delete the session
    await this.sessionRepository.deleteById(validatedInput.sessionId, validatedInput.userId);

    // Emit event
    await this.eventPublisher.publish({
      type: 'session_revoked',
      userId: validatedInput.userId,
      sessionId: validatedInput.sessionId,
      timestamp: new Date(),
    });

    return { success: true };
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}