import { CommentRepository } from './ports/comment-repository';

export class ListIssueComments {
  constructor(
    private commentRepository: CommentRepository,
  ) {}

  async execute(issueId: string) {
    return this.commentRepository.findByIssueId(issueId);
  }
}
