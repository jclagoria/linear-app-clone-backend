import { eq, and } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { issueWatchers, IssueWatcher, NewIssueWatcher } from '../../domain/issue-watcher';
import { WatcherRepository } from '../../application/ports/watcher-repository';

export class DrizzleWatcherRepository implements WatcherRepository {
  async findByIssueId(issueId: string): Promise<IssueWatcher[]> {
    return db
      .select()
      .from(issueWatchers)
      .where(eq(issueWatchers.issueId, issueId));
  }

  async findOne(issueId: string, userId: string): Promise<IssueWatcher | null> {
    const result = await db
      .select()
      .from(issueWatchers)
      .where(and(eq(issueWatchers.issueId, issueId), eq(issueWatchers.userId, userId)))
      .limit(1);
    return result[0] || null;
  }

  async create(watcher: NewIssueWatcher): Promise<IssueWatcher> {
    const result = await db.insert(issueWatchers).values(watcher).returning();
    return result[0];
  }

  async delete(issueId: string, userId: string): Promise<void> {
    await db
      .delete(issueWatchers)
      .where(and(eq(issueWatchers.issueId, issueId), eq(issueWatchers.userId, userId)));
  }
}
