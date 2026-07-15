import { z } from 'zod';
import { LabelRepository } from './ports/label-repository';
import { EventPublisher } from './ports/event-publisher';
import { LabelNameConflictError } from '../domain/errors';

export const CreateLabelInput = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  color: z.string().max(7).nullable().optional(),
});

export type CreateLabelInputType = z.infer<typeof CreateLabelInput>;

export class CreateLabel {
  constructor(
    private labelRepository: LabelRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: CreateLabelInputType, userId: string) {
    const validated = CreateLabelInput.parse(input);

    const existing = await this.labelRepository.findByName(validated.name.trim());
    if (existing) {
      throw new LabelNameConflictError();
    }

    const label = await this.labelRepository.create({
      name: validated.name.trim(),
      description: validated.description ?? null,
      color: validated.color ?? null,
    });

    await this.eventPublisher.publish({
      type: 'label.created',
      userId,
      timestamp: new Date(),
      labelId: label.id,
      name: label.name,
    });

    return label;
  }
}
