import type { GatewayEvent } from '../../../domain/event';

export interface EventBroadcaster {
  broadcast(event: GatewayEvent): Promise<void>;
}
