import { eq, and, isNull, lt, or, gt, asc, desc, inArray, sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { issues, Issue, NewIssue } from '../../domain/issue';
import {
  IssueRepository,
  IssueFilters,
  PaginatedResult,
} from '../../application/ports/issue-repository';

const DEFAULT_LIMIT = 50;

export class DrizzleIssueRepository implements IssueRepository {
  async findById(id: string): Promise<Issue | null> {
    const result = await db
      .select()
      .from(issues)
      .where(or(eq(issues.id, id), eq(issues.identifier, id)))
      .limit(1);
    return result[0] || null;
  }

  async findByIdentifier(teamId: string, identifier: string): Promise<Issue | null> {
    const result = await db
      .select()
      .from(issues)
      .where(and(eq(issues.teamId, teamId), eq(issues.identifier, identifier)))
      .limit(1);
    return result[0] || null;
  }

  async findMany(
    filters: IssueFilters,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<Issue>> {
    const maxLimit = Math.min(limit || DEFAULT_LIMIT, 100);

    // Build conditions
    const conditions = [];

    // Soft-delete filter
    if (!filters.includeDeleted) {
      conditions.push(isNull(issues.deletedAt));
    }

    if (filters.teamId) {
      conditions.push(eq(issues.teamId, filters.teamId));
    }
    if (filters.statusId) {
      conditions.push(eq(issues.statusId, filters.statusId));
    }
    if (filters.assigneeId) {
      conditions.push(eq(issues.assigneeId, filters.assigneeId));
    }
    if (filters.projectId) {
      conditions.push(eq(issues.projectId, filters.projectId));
    }
    if (filters.cycleId) {
      conditions.push(eq(issues.cycleId, filters.cycleId));
    }

    // Cursor-based pagination
    // Default sort: priority DESC, createdAt DESC, id DESC
    if (cursor) {
      try {
        const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
        const cursorCondition = or(
          lt(issues.priority, decoded.priority),
          and(
            eq(issues.priority, decoded.priority),
            or(
              lt(issues.createdAt, new Date(decoded.createdAt)),
              and(
                eq(issues.createdAt, new Date(decoded.createdAt)),
                lt(issues.id, decoded.id),
              ),
            ),
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
      .from(issues)
      .where(whereClause)
      .orderBy(desc(issues.priority), desc(issues.createdAt), desc(issues.id))
      .limit(maxLimit + 1); // Fetch one extra to determine hasMore

    const hasMore = result.length > maxLimit;
    const data = result.slice(0, maxLimit);

    // Build next cursor from last item
    let nextCursor: string | null = null;
    if (hasMore && data.length > 0) {
      const last = data[data.length - 1];
      const cursorObj = {
        priority: last.priority,
        createdAt: last.createdAt.toISOString(),
        id: last.id,
      };
      nextCursor = Buffer.from(JSON.stringify(cursorObj)).toString('base64url');
    }

    return { data, pagination: { nextCursor, hasMore } };
  }

  async getNextSequence(teamId: string): Promise<number> {
    // Use PostgreSQL sequence for atomic increments per team
    const seqName = `issue_seq_${teamId.replace(/-/g, '_')}`;

    // Ensure sequence exists (create if not)
    const createSeq = sql`
      CREATE SEQUENCE IF NOT EXISTS ${sql.identifier(seqName)} START 1 INCREMENT 1
    `;
    await db.execute(createSeq);

    const getNext = sql`
      SELECT nextval(${sql.identifier(seqName)}::regclass) as seq
    `;
    const result = await db.execute(getNext);

    const rows = result as unknown as { seq: number }[];
    return rows[0]?.seq || 1;
  }

  async create(issue: NewIssue): Promise<Issue> {
    const result = await db.insert(issues).values(issue).returning();
    return result[0];
  }

  async update(
    id: string,
    data: Partial<Omit<Issue, 'id' | 'identifier' | 'createdAt'>>,
  ): Promise<Issue> {
    const result = await db
      .update(issues)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(issues.id, id))
      .returning();
    return result[0];
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(issues)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(issues.id, id));
  }
}
