import { z } from 'zod';

export const GetUserProfileSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const UpdateUserProfileSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less').optional(),
  avatarUrl: z.string().url('Invalid URL format').nullable().optional(),
});

export const CreateOrganizationSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
});

export const ListUserOrganizationsSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
});

export const GetOrganizationDetailsSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  organizationId: z.string().uuid('Invalid organization ID format'),
});

export const DeleteOrganizationSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  organizationId: z.string().uuid('Invalid organization ID format'),
});
