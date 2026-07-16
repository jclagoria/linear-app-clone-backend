import { NotificationRepository } from './ports/notification-repository';
import { NotificationEventPublisher } from './ports/event-publisher';

export interface MarkAllNotificationsReadOutput {
  success: true;
  updatedCount: number;
}

export class MarkAllNotificationsRead {
  constructor(
    private notificationRepository: NotificationRepository,
    private eventPublisher: NotificationEventPublisher,
  ) {}

  async execute(userId: string): Promise<MarkAllNotificationsReadOutput> {
    const updatedCount = await this.notificationRepository.markAllRead(userId);

    if (updatedCount > 0) {
      await this.eventPublisher.publish({
        type: 'NotificationRead',
        userId,
        timestamp: new Date(),
        payload: {
          markAll: true,
          updatedCount,
        },
      });
    }

    return { success: true, updatedCount };
  }
}
