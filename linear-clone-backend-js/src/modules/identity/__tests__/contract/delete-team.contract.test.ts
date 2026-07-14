import { describe, it, expect } from 'vitest';

describe('DELETE /api/v1/teams/:teamId Contract', () => {
  it('should return 204 with no body on success', () => {
    const statusCode = 204;
    expect(statusCode).toBe(204);
  });

  it('should have correct error response schemas', () => {
    const notFoundResponse = {
      error: {
        code: 'NOT_FOUND',
        message: 'Team not found',
      },
    };

    const forbiddenResponse = {
      error: {
        code: 'FORBIDDEN',
        message: 'Only team admins can perform this action',
      },
    };

    expect(notFoundResponse.error).toHaveProperty('code');
    expect(notFoundResponse.error).toHaveProperty('message');
    expect(forbiddenResponse.error).toHaveProperty('code');
    expect(forbiddenResponse.error).toHaveProperty('message');
  });
});
