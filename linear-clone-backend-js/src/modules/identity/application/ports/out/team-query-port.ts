/**
 * Port for querying team membership information.
 * Used by the gateway module for channel access validation and auto-subscription.
 */
export interface TeamQueryPort {
  /**
   * Get all team IDs that a user is a member of.
   * @param userId - The user ID to query teams for
   * @returns Array of team IDs the user belongs to
   */
  getUserTeamIds(userId: string): Promise<string[]>;

  /**
   * Check if a user is a member of a specific team.
   * @param userId - The user ID to check
   * @param teamId - The team ID to check membership for
   * @returns true if the user is a member of the team, false otherwise
   */
  isUserMember(userId: string, teamId: string): Promise<boolean>;
}
