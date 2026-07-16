import { EventEmitter } from 'events';
import type { GatewayEvent } from '../../domain/event';
import type { EventBroadcaster } from '../../application/ports/in/event-broadcaster';

export class InProcessEventEmitter implements EventBroadcaster {
  private readonly emitter = new EventEmitter();

  on(callback: (event: GatewayEvent) => void): void {
    this.emitter.on('gateway:event', callback);
  }

  off(callback: (event: GatewayEvent) => void): void {
    this.emitter.off('gateway:event', callback);
  }

  async broadcast(event: GatewayEvent): Promise<void> {
    this.emitter.emit('gateway:event', event);
  }
}
