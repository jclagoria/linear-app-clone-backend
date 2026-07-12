import { describe, it, expect } from 'vitest';
import { LoginUserInput } from '../application/login-user';

describe('LoginUser Input Validation', () => {
  it('should validate valid login input', () => {
    const result = LoginUserInput.safeParse({
      email: 'user@example.com',
      password: 'password123',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = LoginUserInput.safeParse({
      email: 'invalid-email',
      password: 'password123',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty password', () => {
    const result = LoginUserInput.safeParse({
      email: 'user@example.com',
      password: '',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });
    expect(result.success).toBe(false);
  });

  it('should default rememberMe to false', () => {
    const result = LoginUserInput.safeParse({
      email: 'user@example.com',
      password: 'password123',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rememberMe).toBe(false);
    }
  });
});
