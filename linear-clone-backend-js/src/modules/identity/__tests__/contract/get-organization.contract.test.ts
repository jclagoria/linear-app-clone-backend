import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const OrganizationDetailsResponseSchema = z.object({
  data: z.object({
    organization: z.object({
      id: z.string().uuid(),
      name: z.string().min(1).max(255),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  }),
});

describe('GET /api/v1/organizations/:id Contract', () => {
  it('should match response schema on success', () => {
    const response = {
      data: {
        organization: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Organization Details',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    };

    const result = OrganizationDetailsResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
