import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { workflowStates, WorkflowState } from '../../domain/workflow-state';
import { StateRepository } from '../../application/ports/state-repository';

export class DrizzleStateRepository implements StateRepository {
  async findByTeam(teamId: string): Promise<WorkflowState[]> {
    return db
      .select()
      .from(workflowStates)
      .where(eq(workflowStates.teamId, teamId))
      .orderBy(workflowStates.position);
  }

  async findById(id: string): Promise<WorkflowState | null> {
    const result = await db
      .select()
      .from(workflowStates)
      .where(eq(workflowStates.id, id))
      .limit(1);
    return result[0] || null;
  }

  async create(data: { teamId: string; name: string; type: 'unstarted' | 'in_progress' | 'completed' | 'canceled'; position?: number }): Promise<WorkflowState> {
    const result = await db
      .insert(workflowStates)
      .values(data)
      .returning();
    return result[0];
  }

  async update(id: string, data: { name?: string; type?: 'unstarted' | 'in_progress' | 'completed' | 'canceled'; position?: number }): Promise<WorkflowState> {
    const result = await db
      .update(workflowStates)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(workflowStates.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db
      .delete(workflowStates)
      .where(eq(workflowStates.id, id));
  }

  async existsByName(teamId: string, name: string): Promise<boolean> {
    const result = await db
      .select({ id: workflowStates.id })
      .from(workflowStates)
      .where(and(eq(workflowStates.teamId, teamId), eq(workflowStates.name, name)))
      .limit(1);
    return result.length > 0;
  }

  async countByTeamAndType(teamId: string, type: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(workflowStates)
      .where(and(eq(workflowStates.teamId, teamId), sql`${workflowStates.type} = ${type}`));
    return Number(result[0].count);
  }

  async hasCustomStates(teamId: string): Promise<boolean> {
    const result = await db
      .select({ id: workflowStates.id })
      .from(workflowStates)
      .where(eq(workflowStates.teamId, teamId))
      .limit(1);
    return result.length > 0;
  }
}
