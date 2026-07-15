import { HistoryRepository } from './ports/history-repository';

export interface GetStateHistoryInput {
  issueId: string;
  cursor?: string;
  limit?: number;
}

export class GetStateHistory {
  constructor(private historyRepository: HistoryRepository) {}

  async execute(input: GetStateHistoryInput) {
    return this.historyRepository.findByIssuePaginated(input.issueId, input.cursor, input.limit);
  }
}
