import { Cycle, NewCycle } from '../../domain/cycle';

export interface CycleFilters {
  teamId?: string;
  status?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface CycleRepository {
  findById(id: string): Promise<Cycle | null>;
  findMany(filters: CycleFilters, cursor?: string, limit?: number): Promise<PaginatedResult<Cycle>>;
  findByTeam(teamId: string, status?: string, cursor?: string, limit?: number): Promise<PaginatedResult<Cycle>>;
  findActiveByTeam(teamId: string): Promise<Cycle | null>;
  create(cycle: NewCycle): Promise<Cycle>;
  update(id: string, data: Partial<Omit<Cycle, 'id' | 'createdAt'>>): Promise<Cycle>;
  delete(id: string): Promise<void>;
}
