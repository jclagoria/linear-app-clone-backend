import {
  NotificationPreferences,
  NewNotificationPreferences,
} from '../../domain/notification-preferences';

export interface NotificationPreferencesRepository {
  getByUserId(userId: string): Promise<NotificationPreferences | null>;

  upsert(
    userId: string,
    data: Partial<Omit<NewNotificationPreferences, 'userId'>>,
  ): Promise<NotificationPreferences>;
}
