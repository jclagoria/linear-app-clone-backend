import { OrganizationMember, NewOrganizationMember } from '../../domain/organization-member';

export interface OrganizationMemberRepository {
  findByOrganizationId(organizationId: string): Promise<OrganizationMember[]>;
  findByUserId(userId: string): Promise<OrganizationMember[]>;
  findByOrganizationAndUser(organizationId: string, userId: string): Promise<OrganizationMember | null>;
  create(member: NewOrganizationMember): Promise<OrganizationMember>;
  deleteByOrganizationId(organizationId: string): Promise<void>;
}
