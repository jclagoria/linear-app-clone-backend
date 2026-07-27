import { formatChannel, ChannelType } from '../domain/channel';
import type { SubscriptionRepository } from './ports/out/subscription-repository';

/**
 * Auto-subscription logic:
 * When a user authenticates, they are automatically subscribed to:
 * 1. Their own user channel (always)
 * 2. Team channels for teams they belong to (via TeamQueryPort)
 * 3. Issue channels for issues they watch or are assigned to (via IssueQueryPort)
 *
 * Cross-module queries are provided via AuthenticateConnection constructor ports.
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
