import { eq, and, or, lt, desc, sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { projects, Project, NewProject } from '../../domain/project';
import { ProjectRepository, ProjectFilters, PaginatedResult } from '../../application/ports/project-repository';

const DEFAULT_LIMIT = 20;

export class DrizzleProjectRepository implements ProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    return result[0] || null;
  }

  async findMany(filters: ProjectFilters, cursor?: string, limit?: number): Promise<PaginatedResult<Project>> {
    const maxLimit = Math.min(limit || DEFAULT_LIMIT, 100);
    const conditions = [];

    if (filters.teamId) {
      conditions.push(eq(projects.teamId, filters.teamId));
    }
    if (filters.status) {
      conditions.push(eq(projects.status, filters.status as any));
    }

    if (cursor) {
      try {
        const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'));
        const cursorCondition = or(
          lt(projects.createdAt, new Date(decoded.createdAt)),
          and(
            eq(projects.createdAt, new Date(decoded.createdAt)),
            lt(projects.id, decoded.id),
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
      .from(projects)
      .where(whereClause)
      .orderBy(desc(projects.createdAt), desc(projects.id))
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

  async create(project: NewProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async update(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
    const result = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }
}
