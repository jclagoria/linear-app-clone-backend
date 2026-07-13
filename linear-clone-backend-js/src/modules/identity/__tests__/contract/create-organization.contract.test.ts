import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const OrganizationResponseSchema = z.object({
  data: z.object({
    organization: z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(255),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  }),
});

describe('POST /api/v1/organizations Contract', () => {
  it('should match response schema on success', () => {
    const response = {
      data: {
        organization: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'New Organization',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    };

    const result = OrganizationResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
