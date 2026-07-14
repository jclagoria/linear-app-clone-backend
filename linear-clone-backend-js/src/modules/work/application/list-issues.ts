import { z } from 'zod';
import { IssueRepository, IssueFilters } from './ports/issue-repository';

export const ListIssuesQuery = z.object({
  teamId: z.string().uuid().optional(),
  statusId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  cycleId: z.string().uuid().optional(),
  labelIds: z.string().optional(), // comma-separated
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  includeDeleted: z.coerce.boolean().default(false),
});

export type ListIssuesQueryType = z.infer<typeof ListIssuesQuery>;

export class ListIssues {
  constructor(private issueRepository: IssueRepository) {}

  async execute(query: ListIssuesQueryType) {
    const validated = ListIssuesQuery.parse(query);

    const filters: IssueFilters = {
      teamId: validated.teamId,
      statusId: validated.statusId,
      assigneeId: validated.assigneeId,
      projectId: validated.projectId,
      cycleId: validated.cycleId,
      labelIds: validated.labelIds ? validated.labelIds.split(',').map((s) => s.trim()) : undefined,
      includeDeleted: validated.includeDeleted,
    };

    return this.issueRepository.findMany(filters, validated.cursor, validated.limit);
  }
}
