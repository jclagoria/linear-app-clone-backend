import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const ListOrganizationsResponseSchema = z.object({
  data: z.object({
    organizations: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      }),
    ),
  }),
});

describe('GET /api/v1/organizations Contract', () => {
  it('should match response schema with organizations', () => {
    const response = {
      data: {
        organizations: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Organization 1',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    };

    const result = ListOrganizationsResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });

  it('should match response schema with empty list', () => {
    const response = {
      data: {
        organizations: [],
      },
    };

    const result = ListOrganizationsResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
