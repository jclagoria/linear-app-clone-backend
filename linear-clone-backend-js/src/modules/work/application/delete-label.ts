import { LabelRepository } from './ports/label-repository';
import { EventPublisher } from './ports/event-publisher';
import { LabelNotFoundError } from '../domain/errors';

export class DeleteLabel {
  constructor(
    private labelRepository: LabelRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(id: string, userId: string) {
    const existing = await this.labelRepository.findById(id);
    if (!existing) {
      throw new LabelNotFoundError();
    }

    await this.labelRepository.softDelete(id);

    await this.eventPublisher.publish({
      type: 'label.deleted',
      userId,
      timestamp: new Date(),
      labelId: id,
      name: existing.name,
    });
  }
}
