import { z } from 'zod';
import { WatcherRepository } from './ports/watcher-repository';
import { EventPublisher } from './ports/event-publisher';
import { WatcherNotFoundError } from '../domain/errors';

export const RemoveWatcherInput = z.object({
  issueId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type RemoveWatcherInputType = z.infer<typeof RemoveWatcherInput>;

export class RemoveWatcher {
  constructor(
    private watcherRepository: WatcherRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: RemoveWatcherInputType, authenticatedUserId: string) {
    const validated = RemoveWatcherInput.parse(input);

    const existing = await this.watcherRepository.findOne(validated.issueId, validated.userId);
    if (!existing) {
      throw new WatcherNotFoundError();
    }

    await this.watcherRepository.delete(validated.issueId, validated.userId);

    await this.eventPublisher.publish({
      type: 'issue.watcher.removed',
      userId: authenticatedUserId,
      timestamp: new Date(),
      issueId: validated.issueId,
      targetUserId: validated.userId,
    });
  }
}
