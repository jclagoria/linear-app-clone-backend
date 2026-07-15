import { IssueWatcher, NewIssueWatcher } from '../../domain/issue-watcher';

export interface WatcherRepository {
  findByIssueId(issueId: string): Promise<IssueWatcher[]>;
  findOne(issueId: string, userId: string): Promise<IssueWatcher | null>;
  create(watcher: NewIssueWatcher): Promise<IssueWatcher>;
  delete(issueId: string, userId: string): Promise<void>;
}
