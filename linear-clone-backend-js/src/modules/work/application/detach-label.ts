import { z } from 'zod';
import { LabelRepository } from './ports/label-repository';
import { EventPublisher } from './ports/event-publisher';
import { LabelNotFoundError } from '../domain/errors';

export const DetachLabelInput = z.object({
  issueId: z.string().uuid(),
  labelId: z.string().uuid(),
});

export type DetachLabelInputType = z.infer<typeof DetachLabelInput>;

export class DetachLabel {
  constructor(
    private labelRepository: LabelRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: DetachLabelInputType, userId: string) {
    const validated = DetachLabelInput.parse(input);

    const label = await this.labelRepository.findById(validated.labelId);
    if (!label) {
      throw new LabelNotFoundError();
    }

    await this.labelRepository.detachFromIssue(validated.issueId, validated.labelId);

    await this.eventPublisher.publish({
      type: 'issue.label.detached',
      userId,
      timestamp: new Date(),
      issueId: validated.issueId,
      labelId: validated.labelId,
    });
  }
}
