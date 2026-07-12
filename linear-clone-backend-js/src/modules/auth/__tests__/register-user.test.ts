import { describe, it, expect } from 'vitest';
import { RegisterUserInput } from '../application/register-user';

describe('RegisterUser Input Validation', () => {
  it('should validate valid email format', () => {
    const result = RegisterUserInput.safeParse({
      email: 'user@example.com',
      name: 'John Doe',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = RegisterUserInput.safeParse({
      email: 'invalid-email',
      name: 'John Doe',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = RegisterUserInput.safeParse({
      email: 'user@example.com',
      name: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject short password', () => {
    const result = RegisterUserInput.safeParse({
      email: 'user@example.com',
      name: 'John Doe',
      password: '1234567',
    });
    expect(result.success).toBe(false);
  });
});
