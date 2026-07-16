import { describe, it, expect } from 'vitest';
import { parseChannel, formatChannel, validateChannel, ChannelType } from '../domain/channel';

describe('Channel domain', () => {
  describe('parseChannel', () => {
    it('should parse team channel', () => {
      const result = parseChannel('team:abc-123');

      expect(result).not.toBeNull();
      expect(result!.type).toBe(ChannelType.Team);
      expect(result!.id).toBe('abc-123');
    });

    it('should parse issue channel', () => {
      const result = parseChannel('issue:uuid-here');

      expect(result).not.toBeNull();
      expect(result!.type).toBe(ChannelType.Issue);
      expect(result!.id).toBe('uuid-here');
    });

    it('should parse user channel', () => {
      const result = parseChannel('user:user-id');

      expect(result).not.toBeNull();
      expect(result!.type).toBe(ChannelType.User);
      expect(result!.id).toBe('user-id');
    });

    it('should return null for invalid format', () => {
      expect(parseChannel('invalid')).toBeNull();
      expect(parseChannel('')).toBeNull();
      expect(parseChannel('team:')).toBeNull(); // empty id
      expect(parseChannel('unknown:123')).toBeNull();
    });
  });

  describe('formatChannel', () => {
    it('should format channel correctly', () => {
      expect(
        formatChannel({ type: ChannelType.Team, id: 'team-1' }),
      ).toBe('team:team-1');

      expect(
        formatChannel({ type: ChannelType.Issue, id: 'issue-1' }),
      ).toBe('issue:issue-1');

      expect(
        formatChannel({ type: ChannelType.User, id: 'user-1' }),
      ).toBe('user:user-1');
    });
  });

  describe('validateChannel', () => {
    it('should validate correct channel formats', () => {
      expect(validateChannel('team:abc')).toBe(true);
      expect(validateChannel('issue:123')).toBe(true);
      expect(validateChannel('user:user-id')).toBe(true);
    });

    it('should reject invalid channel formats', () => {
      expect(validateChannel('invalid')).toBe(false);
      expect(validateChannel('')).toBe(false);
      expect(validateChannel('team:')).toBe(false);
    });
  });
});
