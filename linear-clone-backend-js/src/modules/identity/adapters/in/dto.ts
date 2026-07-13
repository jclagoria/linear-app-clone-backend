import { z } from 'zod';

// Request schemas
export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less').optional(),
  avatarUrl: z.string().url('Invalid URL format').nullable().optional(),
});

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

export const CreateOrganizationRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
});

export type CreateOrganizationRequest = z.infer<typeof CreateOrganizationRequestSchema>;

export const OrganizationIdParamsSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID format'),
});

export type OrganizationIdParams = z.infer<typeof OrganizationIdParamsSchema>;

// Response schemas
export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
