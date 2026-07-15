import { z } from 'zod';

// Request schemas
export const CreateIssueRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  description: z.string().optional(),
  teamId: z.string().uuid('Invalid team ID format'),
  projectId: z.string().uuid('Invalid project ID format').optional(),
  assigneeId: z.string().uuid('Invalid assignee ID format').optional(),
  priority: z.number().int().min(0).max(4).default(0),
  labelIds: z.array(z.string().uuid()).optional(),
  parentId: z.string().uuid('Invalid parent issue ID format').optional(),
  cycleId: z.string().uuid('Invalid cycle ID format').optional(),
});

export type CreateIssueRequest = z.infer<typeof CreateIssueRequestSchema>;

export const UpdateIssueRequestSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(255).optional(),
  description: z.string().nullable().optional(),
  projectId: z.string().uuid('Invalid project ID format').nullable().optional(),
  priority: z.number().int().min(0).max(4).optional(),
  cycleId: z.string().uuid('Invalid cycle ID format').nullable().optional(),
});

export type UpdateIssueRequest = z.infer<typeof UpdateIssueRequestSchema>;

export const ChangeIssueStatusRequestSchema = z.object({
  statusId: z.string().uuid('Invalid status ID format'),
});

export type ChangeIssueStatusRequest = z.infer<typeof ChangeIssueStatusRequestSchema>;

export const AssignIssueRequestSchema = z.object({
  assigneeId: z.string().uuid('Invalid assignee ID format').nullable(),
});

export type AssignIssueRequest = z.infer<typeof AssignIssueRequestSchema>;

export const ListIssuesQuerySchema = z.object({
  teamId: z.string().uuid().optional(),
  statusId: z.string().uuid().optional(),
  assigneeId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  cycleId: z.string().uuid().optional(),
  labelIds: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  includeDeleted: z.coerce.boolean().default(false),
});

export type ListIssuesQuery = z.infer<typeof ListIssuesQuerySchema>;

export const IdParamsSchema = z.object({
  id: z.string().min(1, 'Issue ID or identifier is required'),
});

export type IdParams = z.infer<typeof IdParamsSchema>;

// Response interfaces
export interface IssueResponse {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  teamId: string;
  projectId: string | null;
  assigneeId: string | null;
  priority: number;
  statusId: string;
  parentId: string | null;
  cycleId: string | null;
  sortOrder: number;
  sequence: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  canceledAt: string | null;
  deletedAt: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

// Comment DTOs
export const CreateCommentRequestSchema = z.object({
  body: z.string().min(1, 'Body is required'),
});

export type CreateCommentRequest = z.infer<typeof CreateCommentRequestSchema>;

export const UpdateCommentRequestSchema = z.object({
  body: z.string().min(1, 'Body is required'),
});

export type UpdateCommentRequest = z.infer<typeof UpdateCommentRequestSchema>;

export const CommentIdParamsSchema = z.object({
  id: z.string().uuid('Invalid issue ID'),
  commentId: z.string().uuid('Invalid comment ID'),
});

export type CommentIdParams = z.infer<typeof CommentIdParamsSchema>;

export interface CommentResponse {
  id: string;
  issueId: string;
  userId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Label DTOs
export const CreateLabelRequestSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  color: z.string().max(7).nullable().optional(),
});

export type CreateLabelRequest = z.infer<typeof CreateLabelRequestSchema>;

export const UpdateLabelRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  color: z.string().max(7).nullable().optional(),
});

export type UpdateLabelRequest = z.infer<typeof UpdateLabelRequestSchema>;

export const LabelIdParamsSchema = z.object({
  id: z.string().uuid('Invalid label ID'),
});

export type LabelIdParams = z.infer<typeof LabelIdParamsSchema>;

export const IssueLabelParamsSchema = z.object({
  id: z.string().uuid('Invalid issue ID'),
  labelId: z.string().uuid('Invalid label ID'),
});

export type IssueLabelParams = z.infer<typeof IssueLabelParamsSchema>;

export interface LabelResponse {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Watcher DTOs
export const AddWatcherRequestSchema = z.object({
  userId: z.string().uuid().optional(),
});

export type AddWatcherRequest = z.infer<typeof AddWatcherRequestSchema>;

export const WatcherIdParamsSchema = z.object({
  id: z.string().uuid('Invalid issue ID'),
  userId: z.string().uuid('Invalid user ID'),
});

export type WatcherIdParams = z.infer<typeof WatcherIdParamsSchema>;

export interface WatcherResponse {
  id: string;
  issueId: string;
  userId: string;
  createdAt: string;
}
