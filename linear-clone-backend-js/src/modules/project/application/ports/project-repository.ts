import { Project, NewProject } from '../../domain/project';

export interface ProjectFilters {
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

export interface ProjectRepository {
  findById(id: string): Promise<Project | null>;
  findMany(filters: ProjectFilters, cursor?: string, limit?: number): Promise<PaginatedResult<Project>>;
  create(project: NewProject): Promise<Project>;
  update(id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project>;
}
