import { WorkflowValidationService, StateHistoryService } from '../../application/ports/workflow-validation-service';
import { ValidateTransition } from '../../../workflow/application/validate-transition';
import { DrizzleHistoryRepository } from '../../../workflow/adapters/out/drizzle-history-repository';

export class WorkflowValidationAdapter implements WorkflowValidationService {
  private validator: ValidateTransition;

  constructor(validator: ValidateTransition) {
    this.validator = validator;
  }

  async validateTransition(input: {
    teamId: string;
    issueId: string;
    toStateId: string;
    fromStateId: string;
  }): Promise<{ valid: boolean; reason: string | null }> {
    const result = await this.validator.execute({
      teamId: input.teamId,
      issueId: input.issueId,
      toStateId: input.toStateId,
      fromStateId: input.fromStateId,
    });
    return { valid: result.valid, reason: result.reason };
  }
}

export class WorkflowStateHistoryAdapter implements StateHistoryService {
  private repo: DrizzleHistoryRepository;

  constructor(repo: DrizzleHistoryRepository) {
    this.repo = repo;
  }

  async recordStatusChange(data: {
    issueId: string;
    fromStateId: string | null;
    toStateId: string;
    userId: string;
  }): Promise<void> {
    await this.repo.create(data);
  }
}
