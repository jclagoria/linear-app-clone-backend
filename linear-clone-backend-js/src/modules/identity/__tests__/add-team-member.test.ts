import { describe, it, expect } from 'vitest';
import { AddTeamMemberInput } from '../application/add-team-member';

describe('AddTeamMember Input Validation', () => {
  it('should validate valid input with default role', () => {
    const result = AddTeamMemberInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      teamId: '550e8400-e29b-41d4-a716-446655440001',
      memberUserId: '550e8400-e29b-41d4-a716-446655440002',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('member');
    }
  });

  it('should validate valid input with admin role', () => {
    const result = AddTeamMemberInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      teamId: '550e8400-e29b-41d4-a716-446655440001',
      memberUserId: '550e8400-e29b-41d4-a716-446655440002',
      role: 'admin',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.role).toBe('admin');
    }
  });

  it('should reject invalid userId', () => {
    const result = AddTeamMemberInput.safeParse({
      userId: 'invalid',
      teamId: '550e8400-e29b-41d4-a716-446655440001',
      memberUserId: '550e8400-e29b-41d4-a716-446655440002',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid teamId', () => {
    const result = AddTeamMemberInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      teamId: 'invalid',
      memberUserId: '550e8400-e29b-41d4-a716-446655440002',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid memberUserId', () => {
    const result = AddTeamMemberInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      teamId: '550e8400-e29b-41d4-a716-446655440001',
      memberUserId: 'invalid',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid role value', () => {
    const result = AddTeamMemberInput.safeParse({
      userId: '550e8400-e29b-41d4-a716-446655440000',
      teamId: '550e8400-e29b-41d4-a716-446655440001',
      memberUserId: '550e8400-e29b-41d4-a716-446655440002',
      role: 'superadmin',
    });
    expect(result.success).toBe(false);
  });
});
