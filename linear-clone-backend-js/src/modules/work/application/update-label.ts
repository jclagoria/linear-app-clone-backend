import { z } from 'zod';
import { LabelRepository } from './ports/label-repository';
import { EventPublisher } from './ports/event-publisher';
import { LabelNotFoundError, LabelNameConflictError } from '../domain/errors';

export const UpdateLabelInput = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  color: z.string().max(7).nullable().optional(),
});

export type UpdateLabelInputType = z.infer<typeof UpdateLabelInput>;

export class UpdateLabel {
  constructor(
    private labelRepository: LabelRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(id: string, input: UpdateLabelInputType, userId: string) {
    const validated = UpdateLabelInput.parse(input);

    const existing = await this.labelRepository.findById(id);
    if (!existing) {
      throw new LabelNotFoundError();
    }

    if (validated.name !== undefined && validated.name.trim() !== existing.name) {
      const conflict = await this.labelRepository.findByName(validated.name.trim());
      if (conflict) {
        throw new LabelNameConflictError();
      }
    }

    const updateData: Record<string, unknown> = {};
    if (validated.name !== undefined) updateData.name = validated.name.trim();
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.color !== undefined) updateData.color = validated.color;

    const updated = await this.labelRepository.update(id, updateData as any);

    await this.eventPublisher.publish({
      type: 'label.updated',
      userId,
      timestamp: new Date(),
      labelId: updated.id,
      name: updated.name,
    });

    return updated;
  }
}
