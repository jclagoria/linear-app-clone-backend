export interface IssueQuery {
  countProjectIssues(projectId: string): Promise<number>;
  countCompletedProjectIssues(projectId: string): Promise<number>;
  getIssuesByProject(projectId: string): Promise<Array<{ id: string }>>;
}
