import { z } from 'zod';
import { UserProfileRepository } from './ports/user-profile-repository';
import { EventPublisher } from './ports/event-publisher';
import { ProfileNotFoundError, InvalidAvatarUrlError } from '../domain/errors';

export const UpdateUserProfileInput = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less').optional(),
  avatarUrl: z.string().url('Invalid URL format').nullable().optional(),
});

export type UpdateUserProfileInputType = z.infer<typeof UpdateUserProfileInput>;

export interface UpdateUserProfileOutput {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateUserProfile {
  constructor(
    private userProfileRepository: UserProfileRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: UpdateUserProfileInputType): Promise<UpdateUserProfileOutput> {
    const validatedInput = UpdateUserProfileInput.parse(input);

    const user = await this.userProfileRepository.findById(validatedInput.userId);

    if (!user) {
      throw new ProfileNotFoundError();
    }

    const updateData: { name?: string; avatarUrl?: string | null; updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (validatedInput.name !== undefined) {
      updateData.name = validatedInput.name;
    }

    if (validatedInput.avatarUrl !== undefined) {
      updateData.avatarUrl = validatedInput.avatarUrl;
    }

    const updatedUser = await this.userProfileRepository.update(validatedInput.userId, updateData);

    await this.eventPublisher.publish({
      type: 'UserProfileUpdated',
      userId: validatedInput.userId,
      timestamp: new Date(),
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
