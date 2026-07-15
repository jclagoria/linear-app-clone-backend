export interface WorkflowValidationService {
  validateTransition(input: {
    teamId: string;
    issueId: string;
    toStateId: string;
    fromStateId: string;
  }): Promise<{ valid: boolean; reason: string | null }>;
}

export interface StateHistoryService {
  recordStatusChange(data: {
    issueId: string;
    fromStateId: string | null;
    toStateId: string;
    userId: string;
  }): Promise<void>;
}
