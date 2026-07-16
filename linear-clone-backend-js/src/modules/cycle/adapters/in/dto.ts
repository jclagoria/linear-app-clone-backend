import { z } from 'zod';

export const CreateCycleRequestSchema = z.object({
  teamId: z.string().uuid('Invalid team ID format'),
  name: z.string().min(1, 'Cycle name is required').max(255, 'Cycle name must be 255 characters or less'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
});

export type CreateCycleRequest = z.infer<typeof CreateCycleRequestSchema>;

export const UpdateCycleRequestSchema = z.object({
  name: z.string().min(1, 'Cycle name cannot be empty').max(255).optional(),
  description: z.string().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type UpdateCycleRequest = z.infer<typeof UpdateCycleRequestSchema>;

export const ListCyclesQuerySchema = z.object({
  teamId: z.string().uuid('Invalid team ID format'),
  status: z.enum(['draft', 'active', 'completed']).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListCyclesQuery = z.infer<typeof ListCyclesQuerySchema>;

export const CycleIdParamsSchema = z.object({
  cycleId: z.string().uuid('Invalid cycle ID format'),
});

export type CycleIdParams = z.infer<typeof CycleIdParamsSchema>;

export const TeamIdParamsSchema = z.object({
  teamId: z.string().uuid('Invalid team ID format'),
});

export type TeamIdParams = z.infer<typeof TeamIdParamsSchema>;

export interface CycleResponse {
  id: string;
  teamId: string;
  name: string;
  description: string | null;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface PaginatedCyclesResponse {
  data: CycleResponse[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}
