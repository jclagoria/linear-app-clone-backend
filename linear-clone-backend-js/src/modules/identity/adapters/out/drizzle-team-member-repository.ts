import { eq, and, isNull, sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { teamMembers, TeamMember, NewTeamMember } from '../../domain/team-member';
import { TeamMemberRepository } from '../../application/ports/team-member-repository';

export class DrizzleTeamMemberRepository implements TeamMemberRepository {
  async findById(id: string): Promise<TeamMember | null> {
    const result = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.id, id), isNull(teamMembers.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async findByTeamId(teamId: string): Promise<TeamMember[]> {
    return db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), isNull(teamMembers.deletedAt)));
  }

  async findByUserId(userId: string): Promise<TeamMember[]> {
    return db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.userId, userId), isNull(teamMembers.deletedAt)));
  }

  async findByTeamAndUser(teamId: string, userId: string): Promise<TeamMember | null> {
    const result = await db
      .select()
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, userId),
          isNull(teamMembers.deletedAt),
        ),
      )
      .limit(1);
    return result[0] || null;
  }

  async create(member: NewTeamMember): Promise<TeamMember> {
    const result = await db.insert(teamMembers).values(member).returning();
    return result[0];
  }

  async deleteByTeamId(teamId: string): Promise<void> {
    await db
      .update(teamMembers)
      .set({ deletedAt: new Date() })
      .where(eq(teamMembers.teamId, teamId));
  }

  async deleteByTeamAndUser(teamId: string, userId: string): Promise<void> {
    await db
      .update(teamMembers)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
      );
  }

  async countAdminsByTeamId(teamId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.role, 'admin'),
          isNull(teamMembers.deletedAt),
        ),
      );
    return Number(result[0].count);
  }
}
