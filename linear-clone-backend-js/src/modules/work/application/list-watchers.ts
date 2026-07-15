import { WatcherRepository } from './ports/watcher-repository';

export class ListWatchers {
  constructor(
    private watcherRepository: WatcherRepository,
  ) {}

  async execute(issueId: string) {
    return this.watcherRepository.findByIssueId(issueId);
  }
}
