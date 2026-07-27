import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManageSubscription } from '../application/manage-subscription';
import type { ConnectionRepository } from '../application/ports/out/connection-repository';
import type { SubscriptionRepository } from '../application/ports/out/subscription-repository';
import type { ChannelValidator } from '../application/ports/in/channel-validator';
import { ConnectionStatus } from '../domain/connection';

describe('ManageSubscription', () => {
  let connectionRepo: ConnectionRepository;
  let subscriptionRepo: SubscriptionRepository;
  let channelValidator: ChannelValidator;
  let useCase: ManageSubscription;

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

    channelValidator = {
      validateChannelAccess: vi.fn(),
    };

    useCase = new ManageSubscription(connectionRepo, subscriptionRepo, channelValidator);
  });

  it('should subscribe to valid channel with access', async () => {
    vi.mocked(connectionRepo.findById).mockResolvedValue({
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });
    vi.mocked(channelValidator.validateChannelAccess).mockResolvedValue(true);

    const result = await useCase.execute('conn-1', 'team:abc-123');

    expect(result.success).toBe(true);
    expect(subscriptionRepo.add).toHaveBeenCalledWith('conn-1', 'team:abc-123');
  });

  it('should reject invalid channel format', async () => {
    const result = await useCase.execute('conn-1', 'invalid');

    expect(result.success).toBe(false);
    expect(result.error).toBe('invalid_channel');
    expect(subscriptionRepo.add).not.toHaveBeenCalled();
  });

  it('should reject non-existent connection', async () => {
    vi.mocked(connectionRepo.findById).mockResolvedValue(null);

    const result = await useCase.execute('conn-not-found', 'team:abc-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('connection_not_found');
  });

  it('should reject channel without access', async () => {
    vi.mocked(connectionRepo.findById).mockResolvedValue({
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });
    vi.mocked(channelValidator.validateChannelAccess).mockResolvedValue(false);

    const result = await useCase.execute('conn-1', 'team:abc-123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('forbidden');
    expect(subscriptionRepo.add).not.toHaveBeenCalled();
  });

  it('should be idempotent on duplicate subscribe', async () => {
    vi.mocked(connectionRepo.findById).mockResolvedValue({
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });
    vi.mocked(channelValidator.validateChannelAccess).mockResolvedValue(true);

    const result1 = await useCase.execute('conn-1', 'team:abc-123');
    expect(result1.success).toBe(true);

    const result2 = await useCase.execute('conn-1', 'team:abc-123');
    expect(result2.success).toBe(true);
    expect(subscriptionRepo.add).toHaveBeenCalledTimes(2);
  });

  it('should unsubscribe from channel', async () => {
    const result = await useCase.executeUnsubscribe('conn-1', 'team:abc-123');

    expect(result.success).toBe(true);
    expect(subscriptionRepo.remove).toHaveBeenCalledWith('conn-1', 'team:abc-123');
  });

  it('should silently handle unsubscribe from non-subscribed channel', async () => {
    const result = await useCase.executeUnsubscribe('conn-1', 'team:nonexistent');

    expect(result.success).toBe(true);
  });
});
