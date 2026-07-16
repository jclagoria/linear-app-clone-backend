import { z } from 'zod';
import { NotificationRepository } from './ports/notification-repository';
import { NotificationEventPublisher } from './ports/event-publisher';
import { InvalidNotificationTypeError, NOTIFICATION_TYPES } from '../domain/errors';

export const CreateNotificationInput = z.object({
  userId: z.string().uuid(),
  type: z.enum(NOTIFICATION_TYPES),
  title: z.string().max(255),
  body: z.string().optional(),
  link: z.string().max(500).optional(),
});

export type CreateNotificationInputType = z.infer<typeof CreateNotificationInput>;

export interface CreateNotificationOutput {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
  expiresAt: string;
}

export class CreateNotification {
  constructor(
    private notificationRepository: NotificationRepository,
    private eventPublisher: NotificationEventPublisher,
  ) {}

  async execute(input: CreateNotificationInputType): Promise<CreateNotificationOutput> {
    const validated = CreateNotificationInput.parse(input);

    if (!NOTIFICATION_TYPES.includes(validated.type)) {
      throw new InvalidNotificationTypeError(
        `Invalid notification type: ${validated.type}. Must be one of: ${NOTIFICATION_TYPES.join(', ')}`,
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const notification = await this.notificationRepository.create({
      userId: validated.userId,
      type: validated.type,
      title: validated.title,
      body: validated.body ?? null,
      link: validated.link ?? null,
      createdAt: now,
      expiresAt,
    });

    await this.eventPublisher.publish({
      type: 'NotificationCreated',
      userId: validated.userId,
      timestamp: now,
      payload: {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        link: notification.link,
        createdAt: notification.createdAt.toISOString(),
      },
    });

    return this.toOutput(notification);
  }

  private toOutput(n: {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string | null;
    link: string | null;
    readAt: Date | null;
    createdAt: Date;
    expiresAt: Date;
  }): CreateNotificationOutput {
    return {
      id: n.id,
      userId: n.userId,
      type: n.type,
      title: n.title,
      body: n.body,
      link: n.link,
      readAt: n.readAt?.toISOString() ?? null,
      createdAt: n.createdAt.toISOString(),
      expiresAt: n.expiresAt.toISOString(),
    };
  }
}
