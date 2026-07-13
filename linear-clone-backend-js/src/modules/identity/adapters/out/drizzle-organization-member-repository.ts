import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { organizationMembers, OrganizationMember, NewOrganizationMember } from '../../domain/organization-member';
import { OrganizationMemberRepository } from '../../application/ports/organization-member-repository';

export class DrizzleOrganizationMemberRepository implements OrganizationMemberRepository {
  async findByOrganizationId(organizationId: string): Promise<OrganizationMember[]> {
    return db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          isNull(organizationMembers.deletedAt),
        ),
      );
  }

  async findByUserId(userId: string): Promise<OrganizationMember[]> {
    return db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.userId, userId),
          isNull(organizationMembers.deletedAt),
        ),
      );
  }

  async findByOrganizationAndUser(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationMember | null> {
    const result = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
          isNull(organizationMembers.deletedAt),
        ),
      )
      .limit(1);
    return result[0] || null;
  }

  async create(member: NewOrganizationMember): Promise<OrganizationMember> {
    const result = await db.insert(organizationMembers).values(member).returning();
    return result[0];
  }

  async deleteByOrganizationId(organizationId: string): Promise<void> {
    await db
      .update(organizationMembers)
      .set({ deletedAt: new Date() })
      .where(eq(organizationMembers.organizationId, organizationId));
  }
}
