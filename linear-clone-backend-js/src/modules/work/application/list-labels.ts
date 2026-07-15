import { LabelRepository } from './ports/label-repository';

export class ListLabels {
  constructor(
    private labelRepository: LabelRepository,
  ) {}

  async execute() {
    return this.labelRepository.findAll();
  }
}
