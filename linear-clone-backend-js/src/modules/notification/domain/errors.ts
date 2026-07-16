export class NotificationNotFoundError extends Error {
  constructor(message = 'Notification not found') {
    super(message);
    this.name = 'NotificationNotFoundError';
  }
}

export class NotificationNotOwnerError extends Error {
  constructor(message = 'User does not own this notification') {
    super(message);
    this.name = 'NotificationNotOwnerError';
  }
}

export class InvalidNotificationTypeError extends Error {
  constructor(message = 'Invalid notification type') {
    super(message);
    this.name = 'InvalidNotificationTypeError';
  }
}

export class InvalidFilterError extends Error {
  constructor(message = 'Invalid filter value') {
    super(message);
    this.name = 'InvalidFilterError';
  }
}

export const NOTIFICATION_TYPES = [
  'issue_assigned',
  'issue_mentioned',
  'comment_added',
  'statusChanged',
  'cycle_started',
  'cycle_completed',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
