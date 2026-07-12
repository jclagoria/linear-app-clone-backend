import { EventPublisher, Event } from '../../application/ports/event-publisher';

export class InMemoryEventPublisher implements EventPublisher {
  private listeners: Map<string, Array<(event: Event) => void>> = new Map();

  async publish(event: Event): Promise<void> {
    const handlers = this.listeners.get(event.type) || [];
    for (const handler of handlers) {
      handler(event);
    }
  }

  on(eventType: string, handler: (event: Event) => void): void {
    const handlers = this.listeners.get(eventType) || [];
    handlers.push(handler);
    this.listeners.set(eventType, handlers);
  }

  off(eventType: string, handler: (event: Event) => void): void {
    const handlers = this.listeners.get(eventType) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.listeners.set(eventType, handlers);
    }
  }
}
