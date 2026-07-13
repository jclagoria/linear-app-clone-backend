import { Session, NewSession } from '../../domain/session';

export interface SessionRepository {
  create(session: NewSession): Promise<Session>;
  findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null>;
  findById(id: string, userId: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  deleteById(id: string, userId: string): Promise<void>;
  deleteByIds(ids: string[], userId: string): Promise<void>;
  findOldestByUserId(userId: string): Promise<Session | null>;
  deleteByRefreshTokenHash(refreshTokenHash: string): Promise<void>;
  countByUserId(userId: string): Promise<number>;
  deleteOldestByUserId(userId: string, limit: number): Promise<void>;
  deleteExpired(): Promise<void>;
}
