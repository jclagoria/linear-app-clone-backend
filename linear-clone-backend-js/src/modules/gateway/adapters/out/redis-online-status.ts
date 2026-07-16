import type Redis from 'ioredis';
import type { OnlineStatus } from '../../application/ports/out/online-status';

const ONLINE_PREFIX = 'online:';
const ONLINE_TTL = 30; // seconds

export class RedisOnlineStatus implements OnlineStatus {
  constructor(private readonly redis: Redis) {}

  async setOnline(userId: string): Promise<void> {
    await this.redis.setex(`${ONLINE_PREFIX}${userId}`, ONLINE_TTL, '1');
  }

  async setOffline(userId: string): Promise<void> {
    await this.redis.del(`${ONLINE_PREFIX}${userId}`);
  }

  async isOnline(userId: string): Promise<boolean> {
    const result = await this.redis.get(`${ONLINE_PREFIX}${userId}`);
    return result === '1';
  }
}
