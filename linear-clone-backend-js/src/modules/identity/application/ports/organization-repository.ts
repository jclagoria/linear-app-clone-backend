import { Organization, NewOrganization } from '../../domain/organization';

export interface OrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  findByName(name: string): Promise<Organization | null>;
  findByOwnerId(ownerId: string): Promise<Organization[]>;
  create(organization: NewOrganization): Promise<Organization>;
  delete(id: string): Promise<void>;
}
