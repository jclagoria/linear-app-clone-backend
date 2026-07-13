import { describe, it, expect } from 'vitest';
import { CreateOrganizationInput } from '../application/create-organization';

describe('CreateOrganization Input Validation', () => {
  it('should validate valid organization name', () => {
    const result = CreateOrganizationInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'My Organization',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid user ID', () => {
    const result = CreateOrganizationInput.safeParse({
      userId: 'invalid-id',
      name: 'My Organization',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = CreateOrganizationInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject name exceeding 255 characters', () => {
    const result = CreateOrganizationInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'a'.repeat(256),
    });
    expect(result.success).toBe(false);
  });
});
