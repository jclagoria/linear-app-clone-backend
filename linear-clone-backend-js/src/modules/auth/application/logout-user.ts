import { z } from 'zod';
import { SessionRepository } from './ports/session-repository';
import { EventPublisher } from './ports/event-publisher';

export const LogoutUserInput = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export type LogoutUserInputType = z.infer<typeof LogoutUserInput>;

export interface LogoutUserOutput {
  success: true;
}

export class LogoutUser {
  constructor(
    private sessionRepository: SessionRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: LogoutUserInputType): Promise<LogoutUserOutput> {
    const validatedInput = LogoutUserInput.parse(input);

    // Find all sessions for the user and delete them
    // The session repository doesn't have a deleteByUserId method, so we'll need to add one
    // For now, we'll use a workaround by counting and deleting oldest
    const sessionCount = await this.sessionRepository.countByUserId(validatedInput.userId);
    if (sessionCount > 0) {
      await this.sessionRepository.deleteOldestByUserId(validatedInput.userId, sessionCount);
    }

    // Emit event
    await this.eventPublisher.publish({
      type: 'UserLoggedOut',
      userId: validatedInput.userId,
      timestamp: new Date(),
    });

    return { success: true };
  }
}
