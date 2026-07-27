import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticateConnection } from '../application/authenticate-connection';
import type { ConnectionRepository } from '../application/ports/out/connection-repository';
import type { SubscriptionRepository } from '../application/ports/out/subscription-repository';
import type { OnlineStatus } from '../application/ports/out/online-status';
import type { TokenVerifier } from '../application/ports/out/token-verifier';
import type { TeamQueryPort } from '../../identity/application/ports/out/team-query-port';
import type { IssueQueryPort } from '../../work/application/ports/out/issue-query-port';

describe('AuthenticateConnection', () => {
  let connectionRepo: ConnectionRepository;
  let subscriptionRepo: SubscriptionRepository;
  let onlineStatus: OnlineStatus;
  let tokenVerifier: TokenVerifier;
  let teamQueryPort: TeamQueryPort;
  let issueQueryPort: IssueQueryPort;
  let useCase: AuthenticateConnection;

  beforeEach(() => {
    connectionRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      deleteById: vi.fn(),
      findByUserId: vi.fn(),
      findAll: vi.fn(),
    };

    subscriptionRepo = {
      add: vi.fn(),
      remove: vi.fn(),
      findByChannel: vi.fn(),
      findByConnection: vi.fn(),
      removeAllForConnection: vi.fn(),
    };

    onlineStatus = {
      setOnline: vi.fn(),
      setOffline: vi.fn(),
      isOnline: vi.fn(),
    };

    tokenVerifier = {
      verify: vi.fn(),
    };

    teamQueryPort = {
      getUserTeamIds: vi.fn(),
      isUserMember: vi.fn(),
    };

    issueQueryPort = {
      getUserIssueIds: vi.fn(),
      isUserWatchingOrAssigned: vi.fn(),
    };

    useCase = new AuthenticateConnection(
      connectionRepo,
      subscriptionRepo,
      onlineStatus,
      tokenVerifier,
      teamQueryPort,
      issueQueryPort,
    );
  });

  it('should authenticate with valid token', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: true,
      userId: 'user-1',
    });
    vi.mocked(teamQueryPort.getUserTeamIds).mockResolvedValue(['team-1', 'team-2']);
    vi.mocked(issueQueryPort.getUserIssueIds).mockResolvedValue(['issue-1']);

    const result = await useCase.execute('valid-token', 'conn-1');

    expect(result.success).toBe(true);
    expect(result.userId).toBe('user-1');
    expect(result.connectionId).toBe('conn-1');
    expect(connectionRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'conn-1',
        userId: 'user-1',
      }),
    );
    expect(onlineStatus.setOnline).toHaveBeenCalledWith('user-1');
  });

  it('should auto-subscribe to user channel', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: true,
      userId: 'user-1',
    });
    vi.mocked(teamQueryPort.getUserTeamIds).mockResolvedValue([]);
    vi.mocked(issueQueryPort.getUserIssueIds).mockResolvedValue([]);

    await useCase.execute('valid-token', 'conn-1');

    expect(subscriptionRepo.add).toHaveBeenCalledWith('conn-1', 'user:user-1');
  });

  it('should auto-subscribe to team channels', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: true,
      userId: 'user-1',
    });
    vi.mocked(teamQueryPort.getUserTeamIds).mockResolvedValue(['team-1', 'team-2']);
    vi.mocked(issueQueryPort.getUserIssueIds).mockResolvedValue([]);

    await useCase.execute('valid-token', 'conn-1');

    expect(subscriptionRepo.add).toHaveBeenCalledWith('conn-1', 'team:team-1');
    expect(subscriptionRepo.add).toHaveBeenCalledWith('conn-1', 'team:team-2');
  });

  it('should auto-subscribe to issue channels', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: true,
      userId: 'user-1',
    });
    vi.mocked(teamQueryPort.getUserTeamIds).mockResolvedValue([]);
    vi.mocked(issueQueryPort.getUserIssueIds).mockResolvedValue(['issue-1', 'issue-2']);

    await useCase.execute('valid-token', 'conn-1');

    expect(subscriptionRepo.add).toHaveBeenCalledWith('conn-1', 'issue:issue-1');
    expect(subscriptionRepo.add).toHaveBeenCalledWith('conn-1', 'issue:issue-2');
  });

  it('should handle query failures gracefully', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: true,
      userId: 'user-1',
    });
    vi.mocked(teamQueryPort.getUserTeamIds).mockRejectedValue(new Error('DB error'));
    vi.mocked(issueQueryPort.getUserIssueIds).mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute('valid-token', 'conn-1');

    // Should still succeed even if queries fail
    expect(result.success).toBe(true);
    // User channel subscription happens before the try-catch, so it should be called
    // But since the queries fail, autoSubscribeUserChannels is not called
    // The user channel subscription is handled in autoSubscribeUserChannels, not directly here
    // So when queries fail, we just log and continue
    expect(connectionRepo.save).toHaveBeenCalled();
    expect(onlineStatus.setOnline).toHaveBeenCalledWith('user-1');
  });

  it('should reject invalid token', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: false,
    });

    const result = await useCase.execute('invalid-token', 'conn-1');

    expect(result.success).toBe(false);
    expect(result.error).toBe('invalid_token');
    expect(connectionRepo.save).not.toHaveBeenCalled();
    expect(subscriptionRepo.add).not.toHaveBeenCalled();
    expect(onlineStatus.setOnline).not.toHaveBeenCalled();
  });

  it('should reject expired token', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: false,
    });

    const result = await useCase.execute('expired-token', 'conn-1');

    expect(result.success).toBe(false);
    expect(result.error).toBe('invalid_token');
  });
});
