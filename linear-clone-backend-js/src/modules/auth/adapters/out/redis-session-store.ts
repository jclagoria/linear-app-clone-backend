import Redis from 'ioredis';
import { db } from '../../../../shared/database';
import { sessions, Session, NewSession } from '../../domain/session';
import { SessionRepository } from '../../application/ports/session-repository';
import { env } from '../../../../shared/config/env';
import { eq, asc, desc, sql, and, inArray, gt } from 'drizzle-orm';

const redis = new Redis(env.REDIS_URL);

export class RedisSessionStore implements SessionRepository {
  async create(session: NewSession): Promise<Session> {
    const result = await db.insert(sessions).values(session).returning();
    const created = result[0];

    // Store in Redis for fast lookup
    const ttl = session.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days
    await redis.setex(
      `session:${created.id}`,
      ttl,
      JSON.stringify({
        userId: created.userId,
        refreshTokenHash: created.refreshTokenHash,
        ipAddress: created.ipAddress,
        userAgent: created.userAgent,
        rememberMe: created.rememberMe,
        createdAt: created.createdAt.toISOString(),
        lastActivityAt: created.lastActivityAt.toISOString(),
        expiresAt: created.expiresAt.toISOString(),
      }),
    );

    return created;
  }

  async findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null> {
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.refreshTokenHash, refreshTokenHash))
      .limit(1);
    return result[0] || null;
  }

  async findById(id: string, userId: string): Promise<Session | null> {
    const result = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
      .limit(1);
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const now = new Date();
    const result = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.userId, userId), gt(sessions.expiresAt, now)))
      .orderBy(desc(sessions.lastActivityAt));
    return result;
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const session = await this.findById(id, userId);
    if (session) {
      await redis.del(`session:${session.id}`);
      await db.delete(sessions).where(and(eq(sessions.id, id), eq(sessions.userId, userId)));
    }
  }

  async deleteByIds(ids: string[], userId: string): Promise<void> {
    if (ids.length === 0) return;

    // Find sessions to delete Redis keys
    const sessionsToDelete = await db
      .select()
      .from(sessions)
      .where(and(inArray(sessions.id, ids), eq(sessions.userId, userId)));

    for (const session of sessionsToDelete) {
      await redis.del(`session:${session.id}`);
    }

    await db.delete(sessions).where(and(inArray(sessions.id, ids), eq(sessions.userId, userId)));
  }

  async findOldestByUserId(userId: string): Promise<Session | null> {
    const result = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(asc(sessions.lastActivityAt))
      .limit(1);
    return result[0] || null;
  }

  async deleteByRefreshTokenHash(refreshTokenHash: string): Promise<void> {
    const session = await this.findByRefreshTokenHash(refreshTokenHash);
    if (session) {
      await redis.del(`session:${session.id}`);
      await db.delete(sessions).where(eq(sessions.refreshTokenHash, refreshTokenHash));
    }
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(sessions)
      .where(eq(sessions.userId, userId));
    return result[0].count;
  }

  async deleteOldestByUserId(userId: string, limit: number): Promise<void> {
    const oldestSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(asc(sessions.lastActivityAt))
      .limit(limit);

    for (const session of oldestSessions) {
      await redis.del(`session:${session.id}`);
      await db.delete(sessions).where(eq(sessions.id, session.id));
    }
  }

  async deleteExpired(): Promise<void> {
    const expiredSessions = await db
      .select()
      .from(sessions)
      .where(sql`${sessions.expiresAt} < NOW()`);

    for (const session of expiredSessions) {
      await redis.del(`session:${session.id}`);
    }

    await db.delete(sessions).where(sql`${sessions.expiresAt} < NOW()`);
  }
}
