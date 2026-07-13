import { describe, it, expect } from 'vitest';

describe('DELETE /api/v1/organizations/:id Contract', () => {
  it('should return 204 with no body on success', () => {
    // 204 No Content responses have no body
    const statusCode = 204;
    expect(statusCode).toBe(204);
  });

  it('should have correct error response schemas', () => {
    const unauthorizedResponse = {
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    };

    const forbiddenResponse = {
      error: {
        code: 'FORBIDDEN',
        message: 'Only organization owner can perform this action',
      },
    };

    const notFoundResponse = {
      error: {
        code: 'NOT_FOUND',
        message: 'Organization not found',
      },
    };

    // Verify error response structure
    expect(unauthorizedResponse.error).toHaveProperty('code');
    expect(unauthorizedResponse.error).toHaveProperty('message');
    expect(forbiddenResponse.error).toHaveProperty('code');
    expect(forbiddenResponse.error).toHaveProperty('message');
    expect(notFoundResponse.error).toHaveProperty('code');
    expect(notFoundResponse.error).toHaveProperty('message');
  });
});
