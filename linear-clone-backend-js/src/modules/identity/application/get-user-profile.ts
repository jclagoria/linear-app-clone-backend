import { UserProfileRepository } from './ports/user-profile-repository';
import { ProfileNotFoundError } from '../domain/errors';

export interface GetUserProfileInput {
  userId: string;
}

export interface GetUserProfileOutput {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class GetUserProfile {
  constructor(private userProfileRepository: UserProfileRepository) {}

  async execute(input: GetUserProfileInput): Promise<GetUserProfileOutput> {
    const user = await this.userProfileRepository.findById(input.userId);

    if (!user) {
      throw new ProfileNotFoundError();
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
