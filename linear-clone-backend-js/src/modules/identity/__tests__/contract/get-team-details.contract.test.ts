import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const TeamDetailsResponseSchema = z.object({
  data: z.object({
    team: z.object({
      id: z.string().uuid(),
      organizationId: z.string().uuid(),
      name: z.string().min(1).max(255),
      key: z.string().min(1).max(10),
      memberCount: z.number().int().min(0),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
  }),
});

describe('GET /api/v1/teams/:teamId Contract', () => {
  it('should match response schema on success', () => {
    const response = {
      data: {
        team: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          organizationId: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Engineering',
          key: 'ENG',
          memberCount: 5,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    };

    const result = TeamDetailsResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
