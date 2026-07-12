import { Session, NewSession } from '../../domain/session';

export interface SessionRepository {
  create(session: NewSession): Promise<Session>;
  findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null>;
  deleteByRefreshTokenHash(refreshTokenHash: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
  deleteOldestByUserId(userId: string, limit: number): Promise<void>;
  deleteExpired(): Promise<void>;
}
