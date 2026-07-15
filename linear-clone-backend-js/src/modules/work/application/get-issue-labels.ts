import { LabelRepository } from './ports/label-repository';

export class GetIssueLabels {
  constructor(
    private labelRepository: LabelRepository,
  ) {}

  async execute(issueId: string) {
    return this.labelRepository.findByIssueId(issueId);
  }
}
