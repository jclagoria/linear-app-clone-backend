import { z } from 'zod';

export const CreateProjectRequestSchema = z.object({
  teamId: z.string().uuid('Invalid team ID format'),
  name: z.string().min(1, 'Project name is required').max(255, 'Project name must be 255 characters or less'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
});

export type CreateProjectRequest = z.infer<typeof CreateProjectRequestSchema>;

export const UpdateProjectRequestSchema = z.object({
  name: z.string().min(1, 'Project name cannot be empty').max(255).optional(),
  description: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  targetDate: z.string().nullable().optional(),
});

export type UpdateProjectRequest = z.infer<typeof UpdateProjectRequestSchema>;

export const ChangeProjectStatusRequestSchema = z.object({
  status: z.enum(['planned', 'in_progress', 'completed', 'canceled']),
});

export type ChangeProjectStatusRequest = z.infer<typeof ChangeProjectStatusRequestSchema>;

export const AddIssueRequestSchema = z.object({
  issueId: z.string().uuid('Invalid issue ID format'),
});

export type AddIssueRequest = z.infer<typeof AddIssueRequestSchema>;

export const ListProjectsQuerySchema = z.object({
  teamId: z.string().uuid('Invalid team ID format'),
  status: z.enum(['planned', 'in_progress', 'completed', 'canceled']).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListProjectsQuery = z.infer<typeof ListProjectsQuerySchema>;

export const ProjectIdParamsSchema = z.object({
  projectId: z.string().uuid('Invalid project ID format'),
});

export type ProjectIdParams = z.infer<typeof ProjectIdParamsSchema>;

export const ProjectIssueParamsSchema = z.object({
  projectId: z.string().uuid('Invalid project ID format'),
  issueId: z.string().uuid('Invalid issue ID format'),
});

export type ProjectIssueParams = z.infer<typeof ProjectIssueParamsSchema>;

export interface ProjectResponse {
  id: string;
  teamId: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string | null;
  targetDate: string | null;
  progress: number;
  issueCount: number;
  completedIssueCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProjectsResponse {
  data: ProjectResponse[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface ProjectProgressResponse {
  projectId: string;
  totalIssues: number;
  completedIssues: number;
  progress: number;
}
