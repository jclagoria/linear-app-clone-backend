import { Event, EventPublisher } from '../../application/ports/event-publisher';

export class InMemoryEventPublisher implements EventPublisher {
  private events: Event[] = [];

  async publish(event: Event): Promise<void> {
    this.events.push(event);
    // In production, this would publish to a message queue (Redis, Kafka, etc.)
  }

  getEvents(): Event[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}
