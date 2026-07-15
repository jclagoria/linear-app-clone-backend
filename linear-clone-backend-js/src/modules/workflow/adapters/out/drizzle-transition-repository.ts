import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { workflowStates } from '../../domain/workflow-state';
import { workflowTransitions, WorkflowTransition } from '../../domain/workflow-transition';
import { TransitionRepository } from '../../application/ports/transition-repository';

export class DrizzleTransitionRepository implements TransitionRepository {
  async findByTeam(teamId: string, fromStateId?: string): Promise<WorkflowTransition[]> {
    const stateIds = await db
      .select({ id: workflowStates.id })
      .from(workflowStates)
      .where(eq(workflowStates.teamId, teamId));

    if (stateIds.length === 0) return [];

    const ids = stateIds.map(s => s.id);
    const conditions = [sql`${workflowTransitions.fromStateId} = ANY(ARRAY[${sql.join(ids.map(id => sql`${id}::uuid`), sql`, `)}])`];

    if (fromStateId) {
      conditions.push(eq(workflowTransitions.fromStateId, fromStateId));
    }

    return db
      .select()
      .from(workflowTransitions)
      .where(and(...conditions));
  }

  async findById(id: string): Promise<WorkflowTransition | null> {
    const result = await db
      .select()
      .from(workflowTransitions)
      .where(eq(workflowTransitions.id, id))
      .limit(1);
    return result[0] || null;
  }

  async create(data: { fromStateId: string; toStateId: string }): Promise<WorkflowTransition> {
    const result = await db
      .insert(workflowTransitions)
      .values(data)
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await db
      .delete(workflowTransitions)
      .where(eq(workflowTransitions.id, id));
  }

  async existsByFromAndTo(fromStateId: string, toStateId: string): Promise<boolean> {
    const result = await db
      .select({ id: workflowTransitions.id })
      .from(workflowTransitions)
      .where(and(eq(workflowTransitions.fromStateId, fromStateId), eq(workflowTransitions.toStateId, toStateId)))
      .limit(1);
    return result.length > 0;
  }

  async countByStateId(stateId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(workflowTransitions)
      .where(sql`${workflowTransitions.fromStateId} = ${stateId}::uuid OR ${workflowTransitions.toStateId} = ${stateId}::uuid`);
    return Number(result[0].count);
  }
}
