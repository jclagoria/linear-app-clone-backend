import { describe, it, expect } from 'vitest';
import { CreateTeamInput } from '../application/create-team';

describe('CreateTeam Input Validation', () => {
  it('should validate valid team creation input', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Engineering',
      key: 'ENG',
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid user ID', () => {
    const result = CreateTeamInput.safeParse({
      userId: 'invalid-id',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Engineering',
      key: 'ENG',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid organization ID', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: 'invalid-id',
      name: 'Engineering',
      key: 'ENG',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: '',
      key: 'ENG',
    });
    expect(result.success).toBe(false);
  });

  it('should reject name exceeding 255 characters', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'a'.repeat(256),
      key: 'ENG',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty key', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Engineering',
      key: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject key exceeding 10 characters', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Engineering',
      key: 'TOOLONGKEYX',
    });
    expect(result.success).toBe(false);
  });

  it('should reject key with lowercase letters', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Engineering',
      key: 'eng',
    });
    expect(result.success).toBe(false);
  });

  it('should reject key with special characters', () => {
    const result = CreateTeamInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      organizationId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Engineering',
      key: 'ENG-1',
    });
    expect(result.success).toBe(false);
  });
});
