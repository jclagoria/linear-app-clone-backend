import { Notification, NewNotification } from '../../domain/notification';

export interface PaginatedResult<T> {
  data: T[];
  pagination: { nextCursor: string | null; hasMore: boolean };
}

export interface NotificationRepository {
  findMany(
    userId: string,
    filter?: 'read' | 'unread',
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<Notification>>;

  findByUserAndId(userId: string, id: string): Promise<Notification | null>;

  countUnread(userId: string): Promise<number>;

  create(notification: NewNotification): Promise<Notification>;

  markRead(id: string): Promise<Notification>;

  markAllRead(userId: string): Promise<number>;
}
