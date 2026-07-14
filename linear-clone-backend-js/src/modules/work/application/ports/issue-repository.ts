import { Issue, NewIssue } from '../../domain/issue';

export interface IssueFilters {
  teamId?: string;
  statusId?: string;
  assigneeId?: string;
  projectId?: string;
  cycleId?: string;
  labelIds?: string[];
  includeDeleted?: boolean;
}

export interface PaginationCursor {
  priority: number;
  createdAt: Date;
  id: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface IssueRepository {
  findById(id: string): Promise<Issue | null>;
  findByIdentifier(teamId: string, identifier: string): Promise<Issue | null>;
  findMany(filters: IssueFilters, cursor?: string, limit?: number): Promise<PaginatedResult<Issue>>;
  getNextSequence(teamId: string): Promise<number>;
  create(issue: NewIssue): Promise<Issue>;
  update(id: string, data: Partial<Omit<Issue, 'id' | 'identifier' | 'createdAt'>>): Promise<Issue>;
  softDelete(id: string): Promise<void>;
}
