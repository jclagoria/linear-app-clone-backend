export type WorkflowStateType = 'unstarted' | 'in_progress' | 'completed' | 'canceled';

export interface DefaultTransition {
  fromType: WorkflowStateType;
  toType: WorkflowStateType;
}

export interface DefaultState {
  name: string;
  type: WorkflowStateType;
}

export const DEFAULT_WORKFLOW_STATES: DefaultState[] = [
  { name: 'Todo', type: 'unstarted' },
  { name: 'In Progress', type: 'in_progress' },
  { name: 'In Review', type: 'in_progress' },
  { name: 'Done', type: 'completed' },
];

export const DEFAULT_WORKFLOW_TRANSITIONS: DefaultTransition[] = [
  { fromType: 'unstarted', toType: 'in_progress' },
  { fromType: 'in_progress', toType: 'in_progress' },
  { fromType: 'in_progress', toType: 'completed' },
  { fromType: 'completed', toType: 'in_progress' },
];

export function isCanceledType(type: WorkflowStateType): boolean {
  return type === 'canceled';
}
