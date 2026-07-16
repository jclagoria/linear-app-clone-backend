import type { ConnectionRepository } from './ports/out/connection-repository';
import type { SubscriptionRepository } from './ports/out/subscription-repository';
import type { SubscribeUseCase } from './ports/in/subscribe-use-case';
import type { UnsubscribeUseCase } from './ports/in/unsubscribe-use-case';
import { validateChannel } from '../domain/channel';

export class ManageSubscription implements SubscribeUseCase {
  constructor(
    private readonly connectionRepo: ConnectionRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
  ) {}

  async execute(
    connectionId: string,
    channel: string,
  ): Promise<{ success: boolean; error?: string }> {
    if (!validateChannel(channel)) {
      return { success: false, error: 'invalid_channel' };
    }

    const connection = await this.connectionRepo.findById(connectionId);
    if (!connection) {
      return { success: false, error: 'connection_not_found' };
    }

    // Idempotent — already subscribed is fine
    await this.subscriptionRepo.add(connectionId, channel);

    return { success: true };
  }

  async executeUnsubscribe(
    connectionId: string,
    channel: string,
  ): Promise<{ success: boolean; error?: string }> {
    await this.subscriptionRepo.remove(connectionId, channel);
    return { success: true };
  }
}
