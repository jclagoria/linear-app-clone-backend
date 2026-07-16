import { CreateNotification } from './create-notification';

export interface CreateNotificationEvent {
  type: 'issue_assigned' | 'issue_mentioned' | 'comment_added' | 'statusChanged' | 'cycle_started' | 'cycle_completed';
  actorId: string;
  targetId: string;
  metadata: {
    assigneeId?: string;
    issueTitle?: string;
    issueIdentifier?: string;
    commentSnippet?: string;
    mentionedUsers?: string[];
    watcherIds?: string[];
    teamId?: string;
    cycleName?: string;
    teamMemberIds?: string[];
    [key: string]: unknown;
  };
}

export class NotificationService {
  constructor(private createNotification: CreateNotification) {}

  async create(event: CreateNotificationEvent): Promise<void> {
    // Recipient resolution happens in the calling module before invoking this service
    // The calling module determines who should receive notifications
    // This service creates individual notifications per recipient

    const { type, metadata } = event;

    // Determine recipients based on event type
    let recipients: Array<{ userId: string; title: string; body?: string; link?: string }> = [];

    switch (type) {
      case 'issue_assigned':
        if (metadata.assigneeId) {
          recipients.push({
            userId: metadata.assigneeId,
            title: `You were assigned to ${metadata.issueIdentifier || 'an issue'}`,
            body: metadata.issueTitle ? `You have been assigned to '${metadata.issueTitle}'` : undefined,
            link: metadata.issueIdentifier ? `/issues/${metadata.issueIdentifier}` : undefined,
          });
        }
        break;

      case 'issue_mentioned':
        if (metadata.mentionedUsers) {
          recipients = metadata.mentionedUsers.map((userId) => ({
            userId,
            title: `You were mentioned in ${metadata.issueIdentifier || 'an issue'}`,
            body: metadata.commentSnippet ? `"${metadata.commentSnippet.substring(0, 200)}"` : undefined,
            link: metadata.issueIdentifier ? `/issues/${metadata.issueIdentifier}` : undefined,
          }));
        }
        break;

      case 'comment_added':
        if (metadata.watcherIds) {
          // Exclude the actor (comment author) from receiving the notification
          const watchers = metadata.watcherIds.filter((id) => id !== event.actorId);
          recipients = watchers.map((userId) => ({
            userId,
            title: `New comment on ${metadata.issueIdentifier || 'an issue'}`,
            body: metadata.commentSnippet ? `"${metadata.commentSnippet.substring(0, 200)}"` : undefined,
            link: metadata.issueIdentifier ? `/issues/${metadata.issueIdentifier}` : undefined,
          }));
        }
        break;

      case 'statusChanged':
        if (metadata.watcherIds) {
          recipients = metadata.watcherIds.map((userId) => ({
            userId,
            title: `${metadata.issueIdentifier || 'Issue'} status changed`,
            body: metadata.issueTitle ? `'${metadata.issueTitle}' status has been updated` : undefined,
            link: metadata.issueIdentifier ? `/issues/${metadata.issueIdentifier}` : undefined,
          }));
        }
        break;

      case 'cycle_started':
        if (metadata.teamMemberIds) {
          recipients = metadata.teamMemberIds.map((userId) => ({
            userId,
            title: `Cycle ${metadata.cycleName || ''} has started`,
            body: `A new cycle has started${metadata.cycleName ? `: ${metadata.cycleName}` : ''}`,
            link: metadata.teamId ? `/cycles/${metadata.teamId}` : undefined,
          }));
        }
        break;

      case 'cycle_completed':
        if (metadata.teamMemberIds) {
          recipients = metadata.teamMemberIds.map((userId) => ({
            userId,
            title: `Cycle ${metadata.cycleName || ''} completed`,
            body: `A cycle has been completed${metadata.cycleName ? `: ${metadata.cycleName}` : ''}`,
            link: metadata.teamId ? `/cycles/${metadata.teamId}` : undefined,
          }));
        }
        break;
    }

    // Create notifications for all recipients in parallel
    await Promise.all(
      recipients.map((r) =>
        this.createNotification.execute({
          userId: r.userId,
          type,
          title: r.title,
          body: r.body,
          link: r.link,
        }),
      ),
    );
  }
}
