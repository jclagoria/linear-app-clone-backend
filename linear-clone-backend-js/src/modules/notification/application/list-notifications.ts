import { z } from 'zod';
import { NotificationRepository } from './ports/notification-repository';

export const ListNotificationsInput = z.object({
  filter: z.enum(['read', 'unread']).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListNotificationsInputType = z.infer<typeof ListNotificationsInput>;

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface ListNotificationsOutput {
  data: NotificationItem[];
  unreadCount: number;
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
}

function toItem(n: {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
}): NotificationItem {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    link: n.link,
    readAt: n.readAt?.toISOString() ?? null,
    createdAt:
      n.createdAt instanceof Date
        ? n.createdAt.toISOString()
        : String(n.createdAt),
  };
}

export class ListNotifications {
  constructor(
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(
    input: ListNotificationsInputType,
    userId: string,
  ): Promise<ListNotificationsOutput> {
    const validated = ListNotificationsInput.parse(input);

    const [result, unreadCount] = await Promise.all([
      this.notificationRepository.findMany(
        userId,
        validated.filter,
        validated.cursor,
        validated.limit,
      ),
      this.notificationRepository.countUnread(userId),
    ]);

    return {
      data: result.data.map(toItem),
      unreadCount,
      pagination: result.pagination,
    };
  }
}
