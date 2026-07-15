import { TransitionRepository } from './ports/transition-repository';
import { StateRepository } from './ports/state-repository';
import { TeamAdminQuery } from './ports/team-admin-query';
import {
  StateNotFoundError,
  DuplicateTransitionError,
  NotTeamAdminError,
} from '../domain/errors';

export interface CreateTransitionInput {
  teamId: string;
  fromStateId: string;
  toStateId: string;
  userId: string;
}

export class CreateTransition {
  constructor(
    private transitionRepository: TransitionRepository,
    private stateRepository: StateRepository,
    private teamAdminQuery: TeamAdminQuery,
  ) {}

  async execute(input: CreateTransitionInput) {
    const isAdmin = await this.teamAdminQuery.isTeamAdmin(input.teamId, input.userId);
    if (!isAdmin) throw new NotTeamAdminError();

    const fromState = await this.stateRepository.findById(input.fromStateId);
    if (!fromState) throw new StateNotFoundError();

    const toState = await this.stateRepository.findById(input.toStateId);
    if (!toState) throw new StateNotFoundError();

    const exists = await this.transitionRepository.existsByFromAndTo(input.fromStateId, input.toStateId);
    if (exists) throw new DuplicateTransitionError();

    const transition = await this.transitionRepository.create({
      fromStateId: input.fromStateId,
      toStateId: input.toStateId,
    });

    return transition;
  }
}
