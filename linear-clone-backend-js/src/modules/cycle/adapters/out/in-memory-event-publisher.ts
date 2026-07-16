import { CycleEventPublisher, CycleEvent } from '../../application/ports/event-publisher';

export class InMemoryCycleEventPublisher implements CycleEventPublisher {
  async publish(event: CycleEvent): Promise<void> {
    console.log('[CycleEvent]', event.type, event);
  }
}
