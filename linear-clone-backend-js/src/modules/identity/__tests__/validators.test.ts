import { describe, it, expect } from 'vitest';
import {
  GetUserProfileSchema,
  UpdateUserProfileSchema,
  CreateOrganizationSchema,
  ListUserOrganizationsSchema,
  GetOrganizationDetailsSchema,
  DeleteOrganizationSchema,
} from '../application/validators';

describe('Validators', () => {
  describe('GetUserProfileSchema', () => {
    it('should validate valid user ID', () => {
      const result = GetUserProfileSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid user ID', () => {
      const result = GetUserProfileSchema.safeParse({
        userId: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateUserProfileSchema', () => {
    it('should validate valid update', () => {
      const result = UpdateUserProfileSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John',
      });
      expect(result.success).toBe(true);
    });

    it('should validate with avatar URL', () => {
      const result = UpdateUserProfileSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        avatarUrl: 'https://example.com/avatar.png',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('CreateOrganizationSchema', () => {
    it('should validate valid input', () => {
      const result = CreateOrganizationSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Org',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const result = CreateOrganizationSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        name: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('GetOrganizationDetailsSchema', () => {
    it('should validate valid input', () => {
      const result = GetOrganizationDetailsSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: '550e8400-e29b-41d4-a716-446655440001',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid organization ID', () => {
      const result = GetOrganizationDetailsSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('DeleteOrganizationSchema', () => {
    it('should validate valid input', () => {
      const result = DeleteOrganizationSchema.safeParse({
        userId: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: '550e8400-e29b-41d4-a716-446655440001',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid IDs', () => {
      const result = DeleteOrganizationSchema.safeParse({
        userId: 'invalid',
        organizationId: 'also-invalid',
      });
      expect(result.success).toBe(false);
    });
  });
});
