import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const ListTeamMembersResponseSchema = z.object({
  data: z.object({
    members: z.array(
      z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
        name: z.string(),
        email: z.string(),
        role: z.enum(['admin', 'member']),
        joinedAt: z.string().datetime(),
      }),
    ),
  }),
});

describe('GET /api/v1/teams/:teamId/members Contract', () => {
  it('should match response schema with members', () => {
    const response = {
      data: {
        members: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            userId: '550e8400-e29b-41d4-a716-446655440001',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            joinedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    };

    const result = ListTeamMembersResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });

  it('should match response schema with empty list', () => {
    const response = {
      data: {
        members: [],
      },
    };

    const result = ListTeamMembersResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
