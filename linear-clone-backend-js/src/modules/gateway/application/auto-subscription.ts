import { formatChannel, ChannelType } from '../domain/channel';
import type { SubscriptionRepository } from './ports/out/subscription-repository';

/**
 * Auto-subscription logic:
 * When a user authenticates, they are automatically subscribed to:
 * 1. Their own user channel (already done in AuthenticateConnection)
 * 2. Team channels for teams they belong to
 * 3. Issue channels for issues they watch or are assigned to
 *
 * Tasks 2 and 3 require cross-module queries (identity/team, work/watcher)
 * and should be implemented when those integrations are available.
 *
 * For now, this provides a utility for manual subscription scenarios.
 */

export async function autoSubscribeUserChannels(
  connectionId: string,
  userId: string,
  subscriptionRepo: SubscriptionRepository,
  options?: {
    teamIds?: string[];
    issueIds?: string[];
  },
): Promise<void> {
  // Always subscribe to own user channel
  const userChannel = formatChannel({ type: ChannelType.User, id: userId });
  await subscriptionRepo.add(connectionId, userChannel);

  // Subscribe to team channels
  if (options?.teamIds) {
    for (const teamId of options.teamIds) {
      const channel = formatChannel({ type: ChannelType.Team, id: teamId });
      await subscriptionRepo.add(connectionId, channel);
    }
  }

  // Subscribe to issue channels
  if (options?.issueIds) {
    for (const issueId of options.issueIds) {
      const channel = formatChannel({ type: ChannelType.Issue, id: issueId });
      await subscriptionRepo.add(connectionId, channel);
    }
  }
}
