import { describe, it, expect } from 'vitest';
import {
  BaseError,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  BusinessRuleError,
  RateLimitError,
  InternalError,
} from '../index';

describe('Error Classes', () => {
  describe('NotFoundError', () => {
    it('should have correct statusCode and code', () => {
      const error = new NotFoundError();
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });

    it('should have correct default message', () => {
      const error = new NotFoundError();
      expect(error.message).toBe('Resource not found');
    });

    it('should allow custom message', () => {
      const error = new NotFoundError('User not found');
      expect(error.message).toBe('User not found');
    });
  });

  describe('ValidationError', () => {
    it('should have correct statusCode and code', () => {
      const error = new ValidationError();
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should include details array', () => {
      const details = [{ field: 'email', message: 'Invalid email' }];
      const error = new ValidationError('Invalid input', details);
      expect(error.details).toEqual(details);
    });

    it('should not include details when not provided', () => {
      const error = new ValidationError();
      expect(error.details).toBeUndefined();
    });
  });

  describe('ConflictError', () => {
    it('should have correct statusCode and code', () => {
      const error = new ConflictError();
      expect(error.statusCode).toBe(409);
      expect(error.code).toBe('CONFLICT');
    });
  });

  describe('UnauthorizedError', () => {
    it('should have correct statusCode and code', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('ForbiddenError', () => {
    it('should have correct statusCode and code', () => {
      const error = new ForbiddenError();
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });
  });

  describe('BusinessRuleError', () => {
    it('should have correct statusCode and code', () => {
      const error = new BusinessRuleError();
      expect(error.statusCode).toBe(422);
      expect(error.code).toBe('BUSINESS_RULE_ERROR');
    });
  });

  describe('RateLimitError', () => {
    it('should have correct statusCode and code', () => {
      const error = new RateLimitError();
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMITED');
    });
  });

  describe('InternalError', () => {
    it('should have correct statusCode and code', () => {
      const error = new InternalError();
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('SERVER_ERROR');
    });

    it('should have generic message', () => {
      const error = new InternalError();
      expect(error.message).toBe('Internal server error');
    });
  });

  describe('toJSON', () => {
    it('should return correct format for errors without details', () => {
      const error = new NotFoundError('Not found');
      const json = error.toJSON();
      expect(json).toEqual({
        error: {
          code: 'NOT_FOUND',
          message: 'Not found',
        },
      });
    });

    it('should include details for ValidationError', () => {
      const details = [{ field: 'email', message: 'Invalid email' }];
      const error = new ValidationError('Invalid input', details);
      const json = error.toJSON();
      expect(json).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details,
        },
      });
    });

    it('should not include empty details array', () => {
      const error = new ValidationError('Invalid input', []);
      const json = error.toJSON();
      expect(json).not.toHaveProperty('details');
    });
  });
});
