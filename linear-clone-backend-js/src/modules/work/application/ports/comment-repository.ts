import { IssueComment, NewIssueComment } from '../../domain/issue-comment';

export interface CommentRepository {
  findById(id: string): Promise<IssueComment | null>;
  findByIssueId(issueId: string): Promise<IssueComment[]>;
  create(comment: NewIssueComment): Promise<IssueComment>;
  update(id: string, data: Partial<Pick<IssueComment, 'body'>>): Promise<IssueComment>;
  softDelete(id: string): Promise<void>;
}
