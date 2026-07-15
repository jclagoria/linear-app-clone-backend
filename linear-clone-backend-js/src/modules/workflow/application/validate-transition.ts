import { StateRepository } from './ports/state-repository';
import { TransitionRepository } from './ports/transition-repository';
import { StateNotFoundError } from '../domain/errors';
import {
  DEFAULT_WORKFLOW_TRANSITIONS,
  isCanceledType,
  WorkflowStateType,
} from '../domain/default-workflow';

export interface ValidateTransitionInput {
  teamId: string;
  issueId: string;
  toStateId: string;
  fromStateId: string;
}

export interface ValidateTransitionOutput {
  valid: boolean;
  fromState: { id: string; name: string; type: string };
  toState: { id: string; name: string; type: string };
  reason: string | null;
}

export class ValidateTransition {
  constructor(
    private stateRepository: StateRepository,
    private transitionRepository: TransitionRepository,
  ) {}

  async execute(input: ValidateTransitionInput): Promise<ValidateTransitionOutput> {
    const toState = await this.stateRepository.findById(input.toStateId);
    if (!toState) throw new StateNotFoundError();

    const fromState = await this.stateRepository.findById(input.fromStateId);
    if (!fromState) throw new StateNotFoundError();

    const fromInfo = { id: fromState.id, name: fromState.name, type: fromState.type as string };
    const toInfo = { id: toState.id, name: toState.name, type: toState.type as string };

    if (isCanceledType(toState.type as WorkflowStateType)) {
      return { valid: true, fromState: fromInfo, toState: toInfo, reason: null };
    }

    const hasCustom = await this.stateRepository.hasCustomStates(input.teamId);

    if (hasCustom) {
      const transitions = await this.transitionRepository.findByTeam(input.teamId, input.fromStateId);
      const allowed = transitions.some(t => t.toStateId === input.toStateId);
      if (!allowed) {
        return {
          valid: false,
          fromState: fromInfo,
          toState: toInfo,
          reason: 'transition_not_allowed',
        };
      }
      return { valid: true, fromState: fromInfo, toState: toInfo, reason: null };
    }

    const allowed = DEFAULT_WORKFLOW_TRANSITIONS.some(
      t => t.fromType === fromState.type && t.toType === toState.type,
    );
    if (!allowed) {
      return {
        valid: false,
        fromState: fromInfo,
        toState: toInfo,
        reason: 'transition_not_allowed',
      };
    }

    return { valid: true, fromState: fromInfo, toState: toInfo, reason: null };
  }
}
