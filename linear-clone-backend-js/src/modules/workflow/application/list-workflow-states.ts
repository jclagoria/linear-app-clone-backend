import { StateRepository } from './ports/state-repository';

export interface ListWorkflowStatesInput {
  teamId: string;
}

export class ListWorkflowStates {
  constructor(private stateRepository: StateRepository) {}

  async execute(input: ListWorkflowStatesInput) {
    const states = await this.stateRepository.findByTeam(input.teamId);
    return { data: states, total: states.length };
  }
}
