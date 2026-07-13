interface StoreEntry {
  count: number;
  expiresAt: number;
}

export class InMemoryStore {
  private store: Map<string, StoreEntry> = new Map();

  async increment(key: string, windowMs: number): Promise<{ count: number; ttl: number }> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.expiresAt < now) {
      this.store.set(key, { count: 1, expiresAt: now + windowMs });
      return { count: 1, ttl: windowMs };
    }

    entry.count++;
    return { count: entry.count, ttl: entry.expiresAt - now };
  }

  async decrement(key: string): Promise<void> {
    const entry = this.store.get(key);
    if (entry && entry.count > 0) {
      entry.count--;
    }
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  async get(key: string): Promise<{ count: number; ttl: number } | null> {
    const entry = this.store.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return { count: entry.count, ttl: entry.expiresAt - Date.now() };
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt < now) {
        this.store.delete(key);
      }
    }
  }
}
