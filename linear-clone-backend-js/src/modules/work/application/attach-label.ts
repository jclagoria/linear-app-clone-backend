import { z } from 'zod';
import { LabelRepository } from './ports/label-repository';
import { EventPublisher } from './ports/event-publisher';
import { LabelNotFoundError, LabelAlreadyAttachedError } from '../domain/errors';

export interface TeamMemberQuery {
  isTeamMember(teamId: string, userId: string): Promise<boolean>;
}

export interface IssueTeamQuery {
  getIssueTeamId(issueId: string): Promise<string | null>;
}

export const AttachLabelInput = z.object({
  issueId: z.string().uuid(),
  labelId: z.string().uuid(),
});

export type AttachLabelInputType = z.infer<typeof AttachLabelInput>;

export class AttachLabel {
  constructor(
    private labelRepository: LabelRepository,
    private teamMemberQuery: TeamMemberQuery,
    private issueTeamQuery: IssueTeamQuery,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: AttachLabelInputType, userId: string) {
    const validated = AttachLabelInput.parse(input);

    const label = await this.labelRepository.findById(validated.labelId);
    if (!label) {
      throw new LabelNotFoundError();
    }

    const teamId = await this.issueTeamQuery.getIssueTeamId(validated.issueId);
    if (!teamId) {
      throw new Error('Issue not found');
    }

    const isMember = await this.teamMemberQuery.isTeamMember(teamId, userId);
    if (!isMember) {
      throw new Error('User is not a member of this team');
    }

    const alreadyAttached = await this.labelRepository.isAttached(validated.issueId, validated.labelId);
    if (alreadyAttached) {
      throw new LabelAlreadyAttachedError();
    }

    const result = await this.labelRepository.attachToIssue(validated.issueId, validated.labelId);

    await this.eventPublisher.publish({
      type: 'issue.label.attached',
      userId,
      timestamp: new Date(),
      issueId: validated.issueId,
      labelId: validated.labelId,
    });

    return result;
  }
}
