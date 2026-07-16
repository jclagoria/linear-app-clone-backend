// ── Gateway Channel Patterns ──

export const CHANNEL_PATTERNS = {
  TEAM: (teamId: string) => `team:${teamId}`,
  ISSUE: (issueId: string) => `issue:${issueId}`,
  USER: (userId: string) => `user:${userId}`,
} as const;

// ── Gateway Event Types ──

export const GATEWAY_EVENTS = {
  // Issue events
  ISSUE_CREATED: 'issue.created',
  ISSUE_UPDATED: 'issue.updated',
  ISSUE_DELETED: 'issue.deleted',
  ISSUE_ASSIGNED: 'issue.assigned',

  // Comment events
  COMMENT_CREATED: 'comment.created',
  COMMENT_UPDATED: 'comment.updated',

  // Project events
  PROJECT_CREATED: 'project.created',
  PROJECT_UPDATED: 'project.updated',

  // Cycle events
  CYCLE_CREATED: 'cycle.created',
  CYCLE_UPDATED: 'cycle.updated',

  // Team events
  TEAM_MEMBER_ADDED: 'team.member_added',
  TEAM_MEMBER_REMOVED: 'team.member_removed',

  // User events
  USER_ONLINE: 'user.online',
  USER_OFFLINE: 'user.offline',
  SESSION_REVOKED: 'session.revoked',
  NOTIFICATION_CREATED: 'notification.created',
} as const;

// ── Gateway Event Envelope ──

export interface GatewayEventEnvelope {
  type: 'event';
  channel: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  userId: string;
}

export function createGatewayEventEnvelope(
  channel: string,
  eventName: string,
  data: Record<string, unknown>,
  userId: string,
): GatewayEventEnvelope {
  return {
    type: 'event',
    channel,
    event: eventName,
    data,
    timestamp: new Date().toISOString(),
    userId: userId,
  };
}
