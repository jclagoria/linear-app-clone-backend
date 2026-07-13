import { z } from 'zod';
import { OrganizationRepository } from './ports/organization-repository';
import { OrganizationMemberRepository } from './ports/organization-member-repository';
import { EventPublisher } from './ports/event-publisher';
import { OrganizationNameConflictError } from '../domain/errors';

export const CreateOrganizationInput = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
});

export type CreateOrganizationInputType = z.infer<typeof CreateOrganizationInput>;

export interface CreateOrganizationOutput {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateOrganization {
  constructor(
    private organizationRepository: OrganizationRepository,
    private organizationMemberRepository: OrganizationMemberRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: CreateOrganizationInputType): Promise<CreateOrganizationOutput> {
    const validatedInput = CreateOrganizationInput.parse(input);

    const existingOrg = await this.organizationRepository.findByName(validatedInput.name);
    if (existingOrg) {
      throw new OrganizationNameConflictError();
    }

    const organization = await this.organizationRepository.create({
      name: validatedInput.name,
      ownerId: validatedInput.userId,
    });

    await this.organizationMemberRepository.create({
      organizationId: organization.id,
      userId: validatedInput.userId,
      role: 'owner',
    });

    await this.eventPublisher.publish({
      type: 'OrganizationCreated',
      userId: validatedInput.userId,
      timestamp: new Date(),
      organizationId: organization.id,
    });

    return {
      id: organization.id,
      name: organization.name,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }
}
