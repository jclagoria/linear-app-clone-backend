import { OrganizationRepository } from './ports/organization-repository';
import { OrganizationMemberRepository } from './ports/organization-member-repository';
import { OrganizationNotFoundError, NotOrganizationMemberError } from '../domain/errors';

export interface GetOrganizationDetailsInput {
  userId: string;
  organizationId: string;
}

export interface GetOrganizationDetailsOutput {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetOrganizationDetails {
  constructor(
    private organizationRepository: OrganizationRepository,
    private organizationMemberRepository: OrganizationMemberRepository,
  ) {}

  async execute(input: GetOrganizationDetailsInput): Promise<GetOrganizationDetailsOutput> {
    const organization = await this.organizationRepository.findById(input.organizationId);

    if (!organization) {
      throw new OrganizationNotFoundError();
    }

    const membership = await this.organizationMemberRepository.findByOrganizationAndUser(
      input.organizationId,
      input.userId,
    );

    if (!membership) {
      throw new NotOrganizationMemberError();
    }

    return {
      id: organization.id,
      name: organization.name,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
    };
  }
}
