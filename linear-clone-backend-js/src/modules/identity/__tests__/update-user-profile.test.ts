import { describe, it, expect } from 'vitest';
import { UpdateUserProfileInput } from '../application/update-user-profile';

describe('UpdateUserProfile Input Validation', () => {
  it('should validate valid name update', () => {
    const result = UpdateUserProfileInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
    });
    expect(result.success).toBe(true);
  });

  it('should validate valid avatar URL', () => {
    const result = UpdateUserProfileInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      avatarUrl: 'https://example.com/avatar.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('should validate null avatar URL', () => {
    const result = UpdateUserProfileInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      avatarUrl: null,
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid user ID', () => {
    const result = UpdateUserProfileInput.safeParse({
      userId: 'invalid-id',
      name: 'John Doe',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = UpdateUserProfileInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject name exceeding 255 characters', () => {
    const result = UpdateUserProfileInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'a'.repeat(256),
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid avatar URL format', () => {
    const result = UpdateUserProfileInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      avatarUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});
