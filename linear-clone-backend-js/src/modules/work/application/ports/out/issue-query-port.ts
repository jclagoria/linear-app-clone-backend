/**
 * Port for querying issue association information.
 * Used by the gateway module for channel access validation and auto-subscription.
 */
export interface IssueQueryPort {
  /**
   * Get all issue IDs that a user is watching or assigned to.
   * @param userId - The user ID to query issues for
   * @returns Array of issue IDs the user is associated with
   */
  getUserIssueIds(userId: string): Promise<string[]>;

  /**
   * Check if a user is watching or assigned to a specific issue.
   * @param userId - The user ID to check
   * @param issueId - The issue ID to check association for
   * @returns true if the user is watching or assigned to the issue, false otherwise
   */
  isUserWatchingOrAssigned(userId: string, issueId: string): Promise<boolean>;
}
