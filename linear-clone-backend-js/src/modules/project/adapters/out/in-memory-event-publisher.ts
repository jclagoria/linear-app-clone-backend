import { ProjectEventPublisher, ProjectEvent } from '../../application/ports/event-publisher';

export class InMemoryProjectEventPublisher implements ProjectEventPublisher {
  async publish(event: ProjectEvent): Promise<void> {
    // In-memory: no-op for now
    // Future: publish to message broker or WebSocket
    console.log('[ProjectEvent]', event.type, event);
  }
}
