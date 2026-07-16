import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticateConnection } from '../application/authenticate-connection';
import type { ConnectionRepository } from '../application/ports/out/connection-repository';
import type { SubscriptionRepository } from '../application/ports/out/subscription-repository';
import type { OnlineStatus } from '../application/ports/out/online-status';
import type { TokenVerifier } from '../application/ports/out/token-verifier';

describe('AuthenticateConnection', () => {
  let connectionRepo: ConnectionRepository;
  let subscriptionRepo: SubscriptionRepository;
  let onlineStatus: OnlineStatus;
  let tokenVerifier: TokenVerifier;
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

    useCase = new AuthenticateConnection(
      connectionRepo,
      subscriptionRepo,
      onlineStatus,
      tokenVerifier,
    );
  });

  it('should authenticate with valid token', async () => {
    vi.mocked(tokenVerifier.verify).mockResolvedValue({
      valid: true,
      userId: 'user-1',
    });

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
    expect(subscriptionRepo.add).toHaveBeenCalledWith('conn-1', 'user:user-1');
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
