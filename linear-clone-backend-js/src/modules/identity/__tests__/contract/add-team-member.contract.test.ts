import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const AddTeamMemberResponseSchema = z.object({
  data: z.object({
    member: z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
      role: z.enum(['admin', 'member']),
      joinedAt: z.string().datetime(),
    }),
  }),
});

describe('POST /api/v1/teams/:teamId/members Contract', () => {
  it('should match response schema on success', () => {
    const response = {
      data: {
        member: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          role: 'member',
          joinedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    };

    const result = AddTeamMemberResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });

  it('should match response schema with admin role', () => {
    const response = {
      data: {
        member: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          role: 'admin',
          joinedAt: '2024-01-01T00:00:00.000Z',
        },
      },
    };

    const result = AddTeamMemberResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
  });
});
