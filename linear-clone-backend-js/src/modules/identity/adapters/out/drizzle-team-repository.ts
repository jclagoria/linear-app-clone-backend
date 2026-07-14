import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { teams, Team, NewTeam } from '../../domain/team';
import { TeamRepository } from '../../application/ports/team-repository';

export class DrizzleTeamRepository implements TeamRepository {
  async findById(id: string): Promise<Team | null> {
    const result = await db
      .select()
      .from(teams)
      .where(and(eq(teams.id, id), isNull(teams.deletedAt)))
      .limit(1);
    return result[0] || null;
  }

  async findByOrganizationId(organizationId: string): Promise<Team[]> {
    return db
      .select()
      .from(teams)
      .where(and(eq(teams.organizationId, organizationId), isNull(teams.deletedAt)));
  }

  async findByKey(organizationId: string, key: string): Promise<Team | null> {
    const result = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.organizationId, organizationId),
          eq(teams.key, key),
          isNull(teams.deletedAt),
        ),
      )
      .limit(1);
    return result[0] || null;
  }

  async create(team: NewTeam): Promise<Team> {
    const result = await db.insert(teams).values(team).returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db
      .update(teams)
      .set({ deletedAt: new Date() })
      .where(eq(teams.id, id));
  }
}
