import { eq, and, isNull, or } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { issues } from '../../domain/issue';
import { issueWatchers } from '../../domain/issue-watcher';
import type { IssueQueryPort } from '../../application/ports/out/issue-query-port';

/**
 * Drizzle adapter implementing the IssueQueryPort for the work module.
 * Used by the gateway module for channel access validation and auto-subscription.
 */
export class DrizzleIssueQueryPort implements IssueQueryPort {
  async getUserIssueIds(userId: string): Promise<string[]> {
    // Get issues where user is assigned
    const assignedIssues = await db
      .select({ id: issues.id })
      .from(issues)
      .where(and(eq(issues.assigneeId, userId), isNull(issues.deletedAt)));

    // Get issues where user is a watcher
    const watchedIssues = await db
      .select({ issueId: issueWatchers.issueId })
      .from(issueWatchers)
      .where(eq(issueWatchers.userId, userId));

    // Combine and deduplicate
    const issueIds = new Set<string>();
    for (const issue of assignedIssues) {
      issueIds.add(issue.id);
    }
    for (const watcher of watchedIssues) {
      issueIds.add(watcher.issueId);
    }

    return Array.from(issueIds);
  }

  async isUserWatchingOrAssigned(userId: string, issueId: string): Promise<boolean> {
    // Check if user is assigned to the issue
    const assigned = await db
      .select({ id: issues.id })
      .from(issues)
      .where(
        and(
          eq(issues.id, issueId),
          eq(issues.assigneeId, userId),
          isNull(issues.deletedAt),
        ),
      )
      .limit(1);

    if (assigned.length > 0) {
      return true;
    }

    // Check if user is watching the issue
    const watched = await db
      .select({ issueId: issueWatchers.issueId })
      .from(issueWatchers)
      .where(and(eq(issueWatchers.issueId, issueId), eq(issueWatchers.userId, userId)))
      .limit(1);

    return watched.length > 0;
  }
}
