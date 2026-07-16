import { z } from 'zod';
import { NotificationRepository } from './ports/notification-repository';
import { NotificationEventPublisher } from './ports/event-publisher';
import {
  NotificationNotFoundError,
  NotificationNotOwnerError,
} from '../domain/errors';

export const MarkNotificationReadInput = z.object({
  id: z.string().uuid(),
});

export type MarkNotificationReadInputType = z.infer<typeof MarkNotificationReadInput>;

export interface MarkNotificationReadOutput {
  success: true;
}

export class MarkNotificationRead {
  constructor(
    private notificationRepository: NotificationRepository,
    private eventPublisher: NotificationEventPublisher,
  ) {}

  async execute(
    input: MarkNotificationReadInputType,
    userId: string,
  ): Promise<MarkNotificationReadOutput> {
    const validated = MarkNotificationReadInput.parse(input);

    const notification = await this.notificationRepository.findByUserAndId(
      userId,
      validated.id,
    );

    if (!notification) {
      throw new NotificationNotFoundError(
        `Notification ${validated.id} not found`,
      );
    }

    if (notification.userId !== userId) {
      throw new NotificationNotOwnerError(
        'User does not own this notification',
      );
    }

    // Idempotent: skip if already read
    if (notification.readAt) {
      return { success: true };
    }

    await this.notificationRepository.markRead(validated.id);

    await this.eventPublisher.publish({
      type: 'NotificationRead',
      userId,
      timestamp: new Date(),
      payload: {
        id: validated.id,
        readAt: new Date().toISOString(),
      },
    });

    return { success: true };
  }
}
