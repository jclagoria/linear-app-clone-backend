import type { ConnectionRepository } from './ports/out/connection-repository';
import type { SubscriptionRepository } from './ports/out/subscription-repository';
import type { GatewayEvent } from '../domain/event';
import type WebSocket from 'ws';

export class BroadcastEvent {
  constructor(
    private readonly connectionRepo: ConnectionRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
  ) {}

  async execute(event: GatewayEvent): Promise<void> {
    const connectionIds = await this.subscriptionRepo.findByChannel(event.channel);

    const connections = await this.connectionRepo.findAll();
    const connectionMap = new Map(connections.map((c) => [c.id, c]));

    const payload = JSON.stringify(event);

    for (const connectionId of connectionIds) {
      const connection = connectionMap.get(connectionId);
      if (!connection || connection.status === 'disconnected') continue;

      try {
        connection.ws.send(payload);
      } catch {
        // Write error — mark connection as disconnected
        await this.connectionRepo.deleteById(connectionId);
        await this.subscriptionRepo.removeAllForConnection(connectionId);
      }
    }
  }
}
