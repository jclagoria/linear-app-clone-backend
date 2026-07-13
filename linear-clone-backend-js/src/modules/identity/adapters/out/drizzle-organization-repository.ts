import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { organizations, Organization, NewOrganization } from '../../domain/organization';
import { OrganizationRepository } from '../../application/ports/organization-repository';

export class DrizzleOrganizationRepository implements OrganizationRepository {
  async findById(id: string): Promise<Organization | null> {
    const result = await db
      .select()
      .from(organizations)
      .where(and(eq(organizations.id, id), isNull(organizations.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const result = await db
      .select()
      .from(organizations)
      .where(and(eq(organizations.name, name), isNull(organizations.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async findByOwnerId(ownerId: string): Promise<Organization[]> {
    return db
      .select()
      .from(organizations)
      .where(and(eq(organizations.ownerId, ownerId), isNull(organizations.deletedAt)));
  }

  async create(organization: NewOrganization): Promise<Organization> {
    const result = await db.insert(organizations).values(organization).returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db
      .update(organizations)
      .set({ deletedAt: new Date() })
      .where(eq(organizations.id, id));
  }
}
