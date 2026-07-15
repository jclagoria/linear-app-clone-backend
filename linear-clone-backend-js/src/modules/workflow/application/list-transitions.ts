import { TransitionRepository } from './ports/transition-repository';

export interface ListTransitionsInput {
  teamId: string;
  fromStateId?: string;
}

export class ListTransitions {
  constructor(private transitionRepository: TransitionRepository) {}

  async execute(input: ListTransitionsInput) {
    const transitions = await this.transitionRepository.findByTeam(input.teamId, input.fromStateId);
    return { data: transitions };
  }
}
