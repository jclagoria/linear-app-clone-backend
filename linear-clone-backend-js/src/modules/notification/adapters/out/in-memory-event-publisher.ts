import {
  NotificationEventPublisher,
  NotificationEvent,
} from '../../application/ports/event-publisher';

export class InMemoryNotificationEventPublisher
  implements NotificationEventPublisher
{
  public events: NotificationEvent[] = [];

  async publish(event: NotificationEvent): Promise<void> {
    this.events.push(event);
  }

  clear(): void {
    this.events = [];
  }
}
