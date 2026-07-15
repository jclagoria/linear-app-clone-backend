import { eq, and, isNull, asc } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { issueComments, IssueComment, NewIssueComment } from '../../domain/issue-comment';
import { CommentRepository } from '../../application/ports/comment-repository';

export class DrizzleCommentRepository implements CommentRepository {
  async findById(id: string): Promise<IssueComment | null> {
    const result = await db
      .select()
      .from(issueComments)
      .where(and(eq(issueComments.id, id), isNull(issueComments.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async findByIssueId(issueId: string): Promise<IssueComment[]> {
    return db
      .select()
      .from(issueComments)
      .where(and(eq(issueComments.issueId, issueId), isNull(issueComments.deletedAt)))
      .orderBy(asc(issueComments.createdAt));
  }

  async create(comment: NewIssueComment): Promise<IssueComment> {
    const result = await db.insert(issueComments).values(comment).returning();
    return result[0];
  }

  async update(id: string, data: Partial<Pick<IssueComment, 'body'>>): Promise<IssueComment> {
    const result = await db
      .update(issueComments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(issueComments.id, id))
      .returning();
    return result[0];
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(issueComments)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(issueComments.id, id));
  }
}
