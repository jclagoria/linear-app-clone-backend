import type { ConnectionRepository } from './ports/out/connection-repository';
import type { SubscriptionRepository } from './ports/out/subscription-repository';
import type { SubscribeUseCase } from './ports/in/subscribe-use-case';
import type { UnsubscribeUseCase } from './ports/in/unsubscribe-use-case';
import type { ChannelValidator } from './ports/in/channel-validator';
import { validateChannel } from '../domain/channel';
import type { ConnectionRateLimiter } from '../adapters/out/connection-rate-limiter';

export class ManageSubscription implements SubscribeUseCase {
  constructor(
    private readonly connectionRepo: ConnectionRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly channelValidator: ChannelValidator,
    private readonly rateLimiter?: ConnectionRateLimiter,
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

    // Rate limiting
    if (this.rateLimiter && !this.rateLimiter.isAllowed(connectionId)) {
      return { success: false, error: 'rate_limited' };
    }

    // Validate channel access
    const hasAccess = await this.channelValidator.validateChannelAccess(connection.userId, channel);
    if (!hasAccess) {
      return { success: false, error: 'forbidden' };
    }

    // Idempotent — already subscribed is fine
    await this.subscriptionRepo.add(connectionId, channel);

    return { success: true };
  }

  async executeUnsubscribe(
    connectionId: string,
    channel: string,
  ): Promise<{ success: boolean; error?: string }> {
    // Rate limiting
    if (this.rateLimiter && !this.rateLimiter.isAllowed(connectionId)) {
      return { success: false, error: 'rate_limited' };
    }

    await this.subscriptionRepo.remove(connectionId, channel);
    return { success: true };
  }
}
