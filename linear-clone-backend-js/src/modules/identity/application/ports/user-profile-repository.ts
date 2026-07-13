import { User, NewUser } from '../../domain/user';

export interface UserProfileRepository {
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<Pick<User, 'name' | 'avatarUrl' | 'updatedAt'>>): Promise<User>;
}
