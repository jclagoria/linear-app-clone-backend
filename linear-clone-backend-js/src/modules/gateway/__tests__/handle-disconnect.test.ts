import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HandleDisconnect } from '../application/handle-disconnect';
import type { ConnectionRepository } from '../application/ports/out/connection-repository';
import type { SubscriptionRepository } from '../application/ports/out/subscription-repository';
import type { OnlineStatus } from '../application/ports/out/online-status';
import { ConnectionStatus } from '../domain/connection';

describe('HandleDisconnect', () => {
  let connectionRepo: ConnectionRepository;
  let subscriptionRepo: SubscriptionRepository;
  let onlineStatus: OnlineStatus;
  let useCase: HandleDisconnect;

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

    useCase = new HandleDisconnect(connectionRepo, subscriptionRepo, onlineStatus);
  });

  it('should remove connection and subscriptions', async () => {
    vi.mocked(connectionRepo.findById).mockResolvedValue({
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });
    vi.mocked(connectionRepo.findByUserId).mockResolvedValue([]);

    await useCase.execute('conn-1');

    expect(connectionRepo.deleteById).toHaveBeenCalledWith('conn-1');
    expect(subscriptionRepo.removeAllForConnection).toHaveBeenCalledWith('conn-1');
    expect(onlineStatus.setOffline).toHaveBeenCalledWith('user-1');
  });

  it('should mark user offline only when no connections remain', async () => {
    vi.mocked(connectionRepo.findById).mockResolvedValue({
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });
    vi.mocked(connectionRepo.findByUserId).mockResolvedValue([
      {
        id: 'conn-2',
        userId: 'user-1',
        ws: null as any,
        status: ConnectionStatus.Connected,
      },
    ]);

    await useCase.execute('conn-1');

    expect(connectionRepo.deleteById).toHaveBeenCalledWith('conn-1');
    expect(onlineStatus.setOffline).not.toHaveBeenCalled();
  });

  it('should do nothing for non-existent connection', async () => {
    vi.mocked(connectionRepo.findById).mockResolvedValue(null);

    await useCase.execute('conn-not-found');

    expect(connectionRepo.deleteById).not.toHaveBeenCalled();
    expect(subscriptionRepo.removeAllForConnection).not.toHaveBeenCalled();
  });
});
