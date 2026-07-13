import { OrganizationRepository } from './ports/organization-repository';
import { OrganizationMemberRepository } from './ports/organization-member-repository';
import { EventPublisher } from './ports/event-publisher';
import { OrganizationNotFoundError, NotOrganizationOwnerError } from '../domain/errors';

export interface DeleteOrganizationInput {
  userId: string;
  organizationId: string;
}

export class DeleteOrganization {
  constructor(
    private organizationRepository: OrganizationRepository,
    private organizationMemberRepository: OrganizationMemberRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: DeleteOrganizationInput): Promise<void> {
    const organization = await this.organizationRepository.findById(input.organizationId);

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    if (organization.ownerId !== input.userId) {
      throw new NotOrganizationOwnerError();
    }

    await this.organizationMemberRepository.deleteByOrganizationId(input.organizationId);

    await this.organizationRepository.delete(input.organizationId);

    await this.eventPublisher.publish({
      type: 'OrganizationDeleted',
      userId: input.userId,
      timestamp: new Date(),
      organizationId: input.organizationId,
    });
  }
}
