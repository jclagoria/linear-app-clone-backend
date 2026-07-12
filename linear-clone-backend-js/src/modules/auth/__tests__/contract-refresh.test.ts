import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Request/Response schemas based on specs-api/auth.md
const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const RefreshTokenResponseSchema = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z
      .array(
        z.object({
          field: z.string(),
          message: z.string(),
        }),
      )
      .optional(),
  }),
});

describe('POST /api/v1/auth/refresh — Contract Tests', () => {
  describe('Request Schema', () => {
    it('should accept valid refresh token request', () => {
      const result = RefreshTokenRequestSchema.safeParse({
        refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing refreshToken field', () => {
      const result = RefreshTokenRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject empty refreshToken string', () => {
      const result = RefreshTokenRequestSchema.safeParse({
        refreshToken: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-string refreshToken', () => {
      const result = RefreshTokenRequestSchema.safeParse({
        refreshToken: 123,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Response Schema', () => {
    it('should match successful refresh response', () => {
      const response = {
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIs...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIs...',
        },
      };
      const result = RefreshTokenResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should match error response with token_expired', () => {
      const response = {
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Refresh token has expired',
        },
      };
      const result = ErrorResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should match error response with token_revoked', () => {
      const response = {
        error: {
          code: 'TOKEN_REVOKED',
          message: 'Refresh token has been revoked or already used',
        },
      };
      const result = ErrorResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should match error response with validation_failed', () => {
      const response = {
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid input',
          details: [
            {
              field: 'refreshToken',
              message: 'Required',
            },
          ],
        },
      };
      const result = ErrorResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });

    it('should match internal error response', () => {
      const response = {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      };
      const result = ErrorResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    });
  });
});
