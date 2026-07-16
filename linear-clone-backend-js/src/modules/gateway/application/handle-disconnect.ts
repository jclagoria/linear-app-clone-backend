import type { ConnectionRepository } from './ports/out/connection-repository';
import type { SubscriptionRepository } from './ports/out/subscription-repository';
import type { OnlineStatus } from './ports/out/online-status';

export class HandleDisconnect {
  constructor(
    private readonly connectionRepo: ConnectionRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly onlineStatus: OnlineStatus,
  ) {}

  async execute(connectionId: string): Promise<void> {
    const connection = await this.connectionRepo.findById(connectionId);
    if (!connection) return;

    // Remove connection and its subscriptions
    await this.connectionRepo.deleteById(connectionId);
    await this.subscriptionRepo.removeAllForConnection(connectionId);

    // Check if user has other active connections
    const remainingConnections = await this.connectionRepo.findByUserId(connection.userId);

    if (remainingConnections.length === 0) {
      await this.onlineStatus.setOffline(connection.userId);
    }
  }
}
