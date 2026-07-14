import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const ListTeamsResponseSchema = z.object({
  data: z.object({
    teams: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255),
        key: z.string().min(1).max(10),
        memberCount: z.number().int().min(0),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      }),
    ),
  }),
});

describe('GET /api/v1/organizations/:organizationId/teams Contract', () => {
  it('should match response schema with teams', () => {
    const response = {
      data: {
        teams: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Engineering',
            key: 'ENG',
            memberCount: 5,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    };

    const result = ListTeamsResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });

  it('should match response schema with empty list', () => {
    const response = {
      data: {
        teams: [],
      },
    };

    const result = ListTeamsResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
