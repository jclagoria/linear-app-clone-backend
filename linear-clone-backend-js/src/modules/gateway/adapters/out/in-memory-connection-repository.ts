import type { Connection } from '../../domain/connection';
import type { ConnectionRepository } from '../../application/ports/out/connection-repository';

export class InMemoryConnectionRepository implements ConnectionRepository {
  private readonly store = new Map<string, Connection>();

  async save(connection: Connection): Promise<void> {
    this.store.set(connection.id, connection);
  }

  async findById(id: string): Promise<Connection | null> {
    return this.store.get(id) ?? null;
  }

  async deleteById(id: string): Promise<void> {
    this.store.delete(id);
  }

  async findByUserId(userId: string): Promise<Connection[]> {
    return Array.from(this.store.values()).filter((c) => c.userId === userId);
  }

  async findAll(): Promise<Connection[]> {
    return Array.from(this.store.values());
  }
}
