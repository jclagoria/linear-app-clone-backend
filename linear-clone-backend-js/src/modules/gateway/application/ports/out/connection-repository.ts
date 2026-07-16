import type { Connection } from '../../../domain/connection';

export interface ConnectionRepository {
  save(connection: Connection): Promise<void>;
  findById(id: string): Promise<Connection | null>;
  deleteById(id: string): Promise<void>;
  findByUserId(userId: string): Promise<Connection[]>;
  findAll(): Promise<Connection[]>;
}
