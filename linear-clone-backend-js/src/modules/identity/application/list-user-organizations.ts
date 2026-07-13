import { OrganizationMemberRepository } from './ports/organization-member-repository';
import { OrganizationRepository } from './ports/organization-repository';

export interface ListUserOrganizationsInput {
  userId: string;
}

export interface ListUserOrganizationsOutput {
  organizations: Array<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export class ListUserOrganizations {
  constructor(
    private organizationMemberRepository: OrganizationMemberRepository,
    private organizationRepository: OrganizationRepository,
  ) {}

  async execute(input: ListUserOrganizationsInput): Promise<ListUserOrganizationsOutput> {
    const memberships = await this.organizationMemberRepository.findByUserId(input.userId);

    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        const org = await this.organizationRepository.findById(membership.organizationId);
        return org
          ? {
              id: org.id,
              name: org.name,
              createdAt: org.createdAt,
              updatedAt: org.updatedAt,
            }
          : null;
      }),
    );

    return {
      organizations: organizations.filter((org): org is NonNullable<typeof org> => org !== null),
    };
  }
}
