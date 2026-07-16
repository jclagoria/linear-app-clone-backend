import { eq, and, or, lt, desc, sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { cycles, Cycle, NewCycle } from '../../domain/cycle';
import { CycleRepository, CycleFilters, PaginatedResult } from '../../application/ports/cycle-repository';

const DEFAULT_LIMIT = 20;

export class DrizzleCycleRepository implements CycleRepository {
  async findById(id: string): Promise<Cycle | null> {
    const result = await db
      .select()
      .from(cycles)
      .where(eq(cycles.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findMany(filters: CycleFilters, cursor?: string, limit?: number): Promise<PaginatedResult<Cycle>> {
    const maxLimit = Math.min(limit || DEFAULT_LIMIT, 100);
    const conditions = [];

    if (filters.teamId) {
      conditions.push(eq(cycles.teamId, filters.teamId));
    }
    if (filters.status) {
      conditions.push(eq(cycles.status, filters.status as any));
    }

    if (cursor) {
      try {
        const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
        const cursorCondition = or(
          lt(cycles.createdAt, new Date(decoded.createdAt)),
          and(
            eq(cycles.createdAt, new Date(decoded.createdAt)),
            lt(cycles.id, decoded.id),
          ),
        );
        conditions.push(cursorCondition);
      } catch {
        // Invalid cursor — return first page
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select()
      .from(cycles)
      .where(whereClause)
      .orderBy(desc(cycles.createdAt), desc(cycles.id))
      .limit(maxLimit + 1);

    const hasMore = result.length > maxLimit;
    const data = result.slice(0, maxLimit);

    let nextCursor: string | null = null;
    if (hasMore && data.length > 0) {
      const last = data[data.length - 1];
      const cursorObj = {
        createdAt: last.createdAt.toISOString(),
        id: last.id,
      };
      nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64url');
    }

    return { data, pagination: { nextCursor, hasMore } };
  }

  async findByTeam(teamId: string, status?: string, cursor?: string, limit?: number): Promise<PaginatedResult<Cycle>> {
    return this.findMany({ teamId, status }, cursor, limit);
  }

  async findActiveByTeam(teamId: string): Promise<Cycle | null> {
    const result = await db
      .select()
      .from(cycles)
      .where(and(eq(cycles.teamId, teamId), eq(cycles.status, 'active' as any)))
      .limit(1);
    return result[0] || null;
  }

  async create(cycle: NewCycle): Promise<Cycle> {
    const result = await db.insert(cycles).values(cycle).returning();
    return result[0];
  }

  async update(id: string, data: Partial<Omit<Cycle, 'id' | 'createdAt'>>): Promise<Cycle> {
    const result = await db
      .update(cycles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cycles.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db.delete(cycles).where(eq(cycles.id, id));
  }
}
