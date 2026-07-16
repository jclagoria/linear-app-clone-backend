import { NotificationPreferencesRepository } from './ports/notification-preferences-repository';

const DEFAULT_TYPES: Record<string, boolean> = {
  issue_assigned: true,
  issue_mentioned: true,
  comment_added: true,
  statusChanged: true,
  cycle_started: true,
  cycle_completed: true,
};

export interface GetNotificationPreferencesOutput {
  inApp: boolean;
  email: boolean;
  types: Record<string, boolean>;
}

export class GetNotificationPreferences {
  constructor(
    private preferencesRepository: NotificationPreferencesRepository,
  ) {}

  async execute(userId: string): Promise<GetNotificationPreferencesOutput> {
    let preferences = await this.preferencesRepository.getByUserId(userId);

    if (!preferences) {
      preferences = await this.preferencesRepository.upsert(userId, {
        inApp: true,
        email: false,
        types: DEFAULT_TYPES,
      });
    }

    return {
      inApp: preferences.inApp,
      email: preferences.email,
      types: preferences.types as Record<string, boolean>,
    };
  }
}
