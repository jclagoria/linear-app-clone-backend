import { z } from 'zod';
import { NotificationPreferencesRepository } from './ports/notification-preferences-repository';

const DEFAULT_TYPES: Record<string, boolean> = {
  issue_assigned: true,
  issue_mentioned: true,
  comment_added: true,
  statusChanged: true,
  cycle_started: true,
  cycle_completed: true,
};

export const UpdateNotificationPreferencesInput = z.object({
  inApp: z.boolean().optional(),
  email: z.boolean().optional(),
  types: z.record(z.string(), z.boolean()).optional(),
});

export type UpdateNotificationPreferencesInputType = z.infer<
  typeof UpdateNotificationPreferencesInput
>;

export interface UpdateNotificationPreferencesOutput {
  inApp: boolean;
  email: boolean;
  types: Record<string, boolean>;
}

export class UpdateNotificationPreferences {
  constructor(
    private preferencesRepository: NotificationPreferencesRepository,
  ) {}

  async execute(
    input: UpdateNotificationPreferencesInputType,
    userId: string,
  ): Promise<UpdateNotificationPreferencesOutput> {
    const validated = UpdateNotificationPreferencesInput.parse(input);

    const existing = await this.preferencesRepository.getByUserId(userId);

    const mergedTypes = {
      ...((existing?.types as Record<string, boolean> | undefined) ?? DEFAULT_TYPES),
      ...(validated.types ?? {}),
    };

    const preferences = await this.preferencesRepository.upsert(userId, {
      inApp: validated.inApp,
      email: validated.email,
      types: mergedTypes,
    });

    return {
      inApp: preferences.inApp,
      email: preferences.email,
      types: preferences.types as Record<string, boolean>,
    };
  }
}
