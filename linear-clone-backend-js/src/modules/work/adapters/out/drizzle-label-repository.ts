import { eq, and, isNull, asc } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { labels, Label, NewLabel } from '../../domain/label';
import { issueLabels, IssueLabel, NewIssueLabel } from '../../domain/issue-label';
import { LabelRepository } from '../../application/ports/label-repository';

export class DrizzleLabelRepository implements LabelRepository {
  async findById(id: string): Promise<Label | null> {
    const result = await db
      .select()
      .from(labels)
      .where(and(eq(labels.id, id), isNull(labels.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async findByName(name: string): Promise<Label | null> {
    const result = await db
      .select()
      .from(labels)
      .where(and(eq(labels.name, name), isNull(labels.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async findAll(): Promise<Label[]> {
    return db
      .select()
      .from(labels)
      .where(isNull(labels.deletedAt))
      .orderBy(asc(labels.name));
  }

  async findByIssueId(issueId: string): Promise<Label[]> {
    const result = await db
      .select({
        id: labels.id,
        name: labels.name,
        description: labels.description,
        color: labels.color,
        createdAt: labels.createdAt,
        updatedAt: labels.updatedAt,
        deletedAt: labels.deletedAt,
      })
      .from(labels)
      .innerJoin(issueLabels, eq(labels.id, issueLabels.labelId))
      .where(and(eq(issueLabels.issueId, issueId), isNull(labels.deletedAt)));
    return result;
  }

  async create(label: NewLabel): Promise<Label> {
    const result = await db.insert(labels).values(label).returning();
    return result[0];
  }

  async update(id: string, data: Partial<Omit<Label, 'id' | 'createdAt'>>): Promise<Label> {
    const result = await db
      .update(labels)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(labels.id, id))
      .returning();
    return result[0];
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(labels)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(labels.id, id));
  }

  async attachToIssue(issueId: string, labelId: string): Promise<IssueLabel> {
    const result = await db
      .insert(issueLabels)
      .values({ issueId, labelId } as NewIssueLabel)
      .returning();
    return result[0];
  }

  async detachFromIssue(issueId: string, labelId: string): Promise<void> {
    await db
      .delete(issueLabels)
      .where(and(eq(issueLabels.issueId, issueId), eq(issueLabels.labelId, labelId)));
  }

  async isAttached(issueId: string, labelId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(issueLabels)
      .where(and(eq(issueLabels.issueId, issueId), eq(issueLabels.labelId, labelId)))
      .limit(1);
    return result.length > 0;
  }
}
