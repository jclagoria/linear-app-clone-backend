import { eq } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { users, User } from '../../domain/user';
import { UserProfileRepository } from '../../application/ports/user-profile-repository';

export class DrizzleUserProfileRepository implements UserProfileRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0] || null;
  }

  async update(
    id: string,
    data: Partial<Pick<User, 'name' | 'avatarUrl' | 'updatedAt'>>,
  ): Promise<User> {
    const result = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
}
