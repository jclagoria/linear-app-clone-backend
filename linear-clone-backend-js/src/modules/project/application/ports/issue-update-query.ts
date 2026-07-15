export interface IssueUpdateQuery {
  updateIssueProjectId(issueId: string, projectId: string | null): Promise<void>;
  getIssuesByProject(projectId: string): Promise<Array<{ id: string }>>;
}
