import { z } from 'zod';

const workflowStateTypeEnum = z.enum(['unstarted', 'in_progress', 'completed', 'canceled']);

export const WorkflowParamsSchema = z.object({
  workspaceId: z.string().uuid(),
  teamId: z.string().uuid(),
});

export type WorkflowParams = z.infer<typeof WorkflowParamsSchema>;

export const WorkflowStateParamsSchema = z.object({
  workspaceId: z.string().uuid(),
  teamId: z.string().uuid(),
  stateId: z.string().uuid(),
});

export type WorkflowStateParams = z.infer<typeof WorkflowStateParamsSchema>;

export const CreateWorkflowStateSchema = z.object({
  name: z.string().min(1).max(100),
  type: workflowStateTypeEnum,
  position: z.number().int().min(0).optional(),
});

export type CreateWorkflowStateRequest = z.infer<typeof CreateWorkflowStateSchema>;

export const UpdateWorkflowStateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: workflowStateTypeEnum.optional(),
  position: z.number().int().min(0).optional(),
});

export type UpdateWorkflowStateRequest = z.infer<typeof UpdateWorkflowStateSchema>;

export const TransitionParamsSchema = z.object({
  workspaceId: z.string().uuid(),
  teamId: z.string().uuid(),
  transitionId: z.string().uuid(),
});

export type TransitionParams = z.infer<typeof TransitionParamsSchema>;

export const CreateTransitionSchema = z.object({
  fromStateId: z.string().uuid(),
  toStateId: z.string().uuid(),
});

export type CreateTransitionRequest = z.infer<typeof CreateTransitionSchema>;

export const ValidateTransitionSchema = z.object({
  issueId: z.string().uuid(),
  toStateId: z.string().uuid(),
});

export type ValidateTransitionRequest = z.infer<typeof ValidateTransitionSchema>;

export const ListTransitionsQuerySchema = z.object({
  fromStateId: z.string().uuid().optional(),
});

export type ListTransitionsQuery = z.infer<typeof ListTransitionsQuerySchema>;

export const IssueHistoryParamsSchema = z.object({
  issueId: z.string().uuid(),
});

export type IssueHistoryParams = z.infer<typeof IssueHistoryParamsSchema>;

export const ListHistoryQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type ListHistoryQuery = z.infer<typeof ListHistoryQuerySchema>;
