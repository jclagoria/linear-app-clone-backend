import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModuleChannelValidator } from '../adapters/out/module-channel-validator';
import type { TeamQueryPort } from '../../identity/application/ports/out/team-query-port';
import type { IssueQueryPort } from '../../work/application/ports/out/issue-query-port';

describe('ModuleChannelValidator', () => {
  let teamQueryPort: TeamQueryPort;
  let issueQueryPort: IssueQueryPort;
  let validator: ModuleChannelValidator;

  beforeEach(() => {
    teamQueryPort = {
      getUserTeamIds: vi.fn(),
      isUserMember: vi.fn(),
    };

    issueQueryPort = {
      getUserIssueIds: vi.fn(),
      isUserWatchingOrAssigned: vi.fn(),
    };

    validator = new ModuleChannelValidator(teamQueryPort, issueQueryPort);
  });

  describe('team channel validation', () => {
    it('should return true for team member', async () => {
      vi.mocked(teamQueryPort.isUserMember).mockResolvedValue(true);

      const result = await validator.validateChannelAccess('user-1', 'team:team-1');

      expect(result).toBe(true);
      expect(teamQueryPort.isUserMember).toHaveBeenCalledWith('user-1', 'team-1');
    });

    it('should return false for non-member', async () => {
      vi.mocked(teamQueryPort.isUserMember).mockResolvedValue(false);

      const result = await validator.validateChannelAccess('user-1', 'team:team-1');

      expect(result).toBe(false);
    });
  });

  describe('issue channel validation', () => {
    it('should return true for issue watcher', async () => {
      vi.mocked(issueQueryPort.isUserWatchingOrAssigned).mockResolvedValue(true);

      const result = await validator.validateChannelAccess('user-1', 'issue:issue-1');

      expect(result).toBe(true);
      expect(issueQueryPort.isUserWatchingOrAssigned).toHaveBeenCalledWith('user-1', 'issue-1');
    });

    it('should return false for non-watcher', async () => {
      vi.mocked(issueQueryPort.isUserWatchingOrAssigned).mockResolvedValue(false);

      const result = await validator.validateChannelAccess('user-1', 'issue:issue-1');

      expect(result).toBe(false);
    });
  });

  describe('user channel validation', () => {
    it('should return true for own user channel', async () => {
      const result = await validator.validateChannelAccess('user-1', 'user:user-1');

      expect(result).toBe(true);
    });

    it('should return false for other user channel', async () => {
      const result = await validator.validateChannelAccess('user-1', 'user:user-2');

      expect(result).toBe(false);
    });
  });

  describe('invalid channel formats', () => {
    it('should return false for invalid channel format', async () => {
      const result = await validator.validateChannelAccess('user-1', 'invalid');

      expect(result).toBe(false);
    });

    it('should return false for empty channel', async () => {
      const result = await validator.validateChannelAccess('user-1', '');

      expect(result).toBe(false);
    });

    it('should return false for unknown channel type', async () => {
      const result = await validator.validateChannelAccess('user-1', 'unknown:id');

      expect(result).toBe(false);
    });
  });
});
