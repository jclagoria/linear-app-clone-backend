/**
 * Port for validating channel access.
 * Used by ManageSubscription to ensure users only subscribe to channels they have access to.
 */
export interface ChannelValidator {
  /**
   * Validate if a user has access to a specific channel.
   * @param userId - The user ID to validate access for
   * @param channel - The channel to validate (e.g., "team:{id}", "issue:{id}", "user:{id}")
   * @returns true if the user has access, false otherwise
   */
  validateChannelAccess(userId: string, channel: string): Promise<boolean>;
}
