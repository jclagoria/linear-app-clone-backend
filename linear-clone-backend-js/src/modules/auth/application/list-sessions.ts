import { z } from 'zod';
import { SessionRepository } from './ports/session-repository';
import { hashToken } from '../../../shared/utils/crypto';

export const ListSessionsInput = z.object({
  userId: z.string().uuid('Invalid user ID'),
  currentRefreshTokenHash: z.string().optional(),
});

export type ListSessionsInputType = z.infer<typeof ListSessionsInput>;

export interface SessionOutput {
  id: string;
  ipAddress: string;
  userAgent: string;
  rememberMe: boolean;
  createdAt: string;
  lastActivityAt: string;
  isCurrent: boolean;
}

export interface ListSessionsOutput {
  sessions: SessionOutput[];
}

export class ListSessions {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(input: ListSessionsInputType): Promise<ListSessionsOutput> {
    const validatedInput = ListSessionsInput.parse(input);

    // Find all non-expired sessions for the user
    const sessions = await this.sessionRepository.findByUserId(validatedInput.userId);

    // Determine current session by matching refresh token hash
    const currentHash = validatedInput.currentRefreshTokenHash;

    return {
      sessions: sessions.map((session) => ({
        id: session.id,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        rememberMe: session.rememberMe,
        createdAt: session.createdAt.toISOString(),
        lastActivityAt: session.lastActivityAt.toISOString(),
        isCurrent: currentHash ? session.refreshTokenHash === currentHash : false,
      })),
    };
  }
}