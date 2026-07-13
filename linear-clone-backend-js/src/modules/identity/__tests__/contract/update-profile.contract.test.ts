import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const UpdateProfileResponseSchema = z.object({
  data: z.object({
    user: z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      name: z.string().min(1).max(255),
      avatarUrl: z.string().url().nullable(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  }),
});

describe('PATCH /api/v1/users/me Contract', () => {
  it('should match response schema on success', () => {
    const response = {
      data: {
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'user@example.com',
          name: 'Updated Name',
          avatarUrl: 'https://example.com/new-avatar.jpg',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      },
    };

    const result = UpdateProfileResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
