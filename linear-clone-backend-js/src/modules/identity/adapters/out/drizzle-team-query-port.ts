import { eq, and, isNull } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { teamMembers } from '../../domain/team-member';
import type { TeamQueryPort } from '../../application/ports/out/team-query-port';

/**
 * Drizzle adapter implementing the TeamQueryPort for the identity module.
 * Used by the gateway module for channel access validation and auto-subscription.
 */
export class DrizzleTeamQueryPort implements TeamQueryPort {
  async getUserTeamIds(userId: string): Promise<string[]> {
    const results = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(and(eq(teamMembers.userId, userId), isNull(teamMembers.deletedAt)));

    return results.map((r) => r.teamId);
  }

  async isUserMember(userId: string, teamId: string): Promise<boolean> {
    const result = await db
      .select({ id: teamMembers.id })
      .from(teamMembers)
      .where(
        and(
          eq(teamMembers.userId, userId),
          eq(teamMembers.teamId, teamId),
          isNull(teamMembers.deletedAt),
        ),
      )
      .limit(1);

    return result.length > 0;
  }
}
