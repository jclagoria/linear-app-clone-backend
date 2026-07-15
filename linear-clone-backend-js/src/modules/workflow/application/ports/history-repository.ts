import { StateHistoryEntry } from '../../domain/state-history';

export interface HistoryRepository {
  create(data: { issueId: string; fromStateId: string | null; toStateId: string; userId: string }): Promise<StateHistoryEntry>;
  findByIssuePaginated(issueId: string, cursor?: string, limit?: number): Promise<{ data: StateHistoryEntry[]; nextCursor: string | null }>;
}
