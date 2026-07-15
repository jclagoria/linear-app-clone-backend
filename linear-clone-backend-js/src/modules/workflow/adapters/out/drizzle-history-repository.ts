import { eq, desc, lt, isNull, and } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { stateHistory, StateHistoryEntry } from '../../domain/state-history';
import { HistoryRepository } from '../../application/ports/history-repository';

const DEFAULT_LIMIT = 50;

export class DrizzleHistoryRepository implements HistoryRepository {
  async create(data: { issueId: string; fromStateId: string | null; toStateId: string; userId: string }): Promise<StateHistoryEntry> {
    const result = await db
      .insert(stateHistory)
      .values(data)
      .returning();
    return result[0];
  }

  async findByIssuePaginated(
    issueId: string,
    cursor?: string,
    limit?: number,
  ): Promise<{ data: StateHistoryEntry[]; nextCursor: string | null }> {
    const maxLimit = Math.min(limit || DEFAULT_LIMIT, 100);
    const conditions = [eq(stateHistory.issueId, issueId)];

    if (cursor) {
      conditions.push(lt(stateHistory.createdAt, new Date(cursor)));
    }

    const rows = await db
      .select()
      .from(stateHistory)
      .where(and(...conditions))
      .orderBy(desc(stateHistory.createdAt))
      .limit(maxLimit + 1);

    const hasMore = rows.length > maxLimit;
    const data = hasMore ? rows.slice(0, maxLimit) : rows;
    const nextCursor = hasMore && data.length > 0
      ? data[data.length - 1].createdAt.toISOString()
      : null;

    return { data, nextCursor };
  }
}
