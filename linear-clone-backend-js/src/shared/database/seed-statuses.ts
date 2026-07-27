import { db } from '.';
import { eq } from 'drizzle-orm';
import { issueStatuses, DEFAULT_STATUSES } from '../../modules/work/domain/issue-status';

export async function seedDefaultStatuses(): Promise<void> {
  const existing = await db.select().from(issueStatuses).limit(1);
  if (existing.length > 0) return;

  await db.insert(issueStatuses).values([...DEFAULT_STATUSES]).onConflictDoNothing();
}
