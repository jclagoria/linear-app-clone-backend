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

// Team schemas
export const CreateTeamRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  key: z
    .string()
    .min(1, 'Key is required')
    .max(10, 'Key must be 10 characters or less')
    .transform((v) => v.toUpperCase())
    .refine((v) => /^[A-Z]+$/.test(v), 'Key must be uppercase letters only'),
});

export type CreateTeamRequest = z.infer<typeof CreateTeamRequestSchema>;

export const TeamIdParamsSchema = z.object({
  teamId: z.string().uuid('Invalid team ID format'),
});

export type TeamIdParams = z.infer<typeof TeamIdParamsSchema>;

export const TeamMemberUserIdParamsSchema = z.object({
  teamId: z.string().uuid('Invalid team ID format'),
  userId: z.string().uuid('Invalid user ID format'),
});

export type TeamMemberUserIdParams = z.infer<typeof TeamMemberUserIdParamsSchema>;

export const AddTeamMemberRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  role: z.enum(['member', 'admin']).default('member'),
});

export type AddTeamMemberRequest = z.infer<typeof AddTeamMemberRequestSchema>;

// Response interfaces
export interface TeamResponse {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
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
