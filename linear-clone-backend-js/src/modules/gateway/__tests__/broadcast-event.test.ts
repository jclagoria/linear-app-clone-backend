import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BroadcastEvent } from '../application/broadcast-event';
import type { ConnectionRepository } from '../application/ports/out/connection-repository';
import type { SubscriptionRepository } from '../application/ports/out/subscription-repository';
import { ConnectionStatus } from '../domain/connection';
import type { GatewayEvent } from '../domain/event';
import type WebSocket from 'ws';

describe('BroadcastEvent', () => {
  let connectionRepo: ConnectionRepository;
  let subscriptionRepo: SubscriptionRepository;
  let useCase: BroadcastEvent;
  let mockWs: WebSocket;

  const testEvent: GatewayEvent = {
    type: 'event',
    channel: 'team:abc-123',
    event: 'issue.created',
    data: { title: 'Test issue' },
    timestamp: '2026-07-16T12:00:00.000Z',
    userId: 'user-1',
  };

  beforeEach(() => {
    mockWs = {
      send: vi.fn(),
      readyState: 1, // WebSocket.OPEN
    } as unknown as WebSocket;

    connectionRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      deleteById: vi.fn(),
      findByUserId: vi.fn(),
      findAll: vi.fn().mockResolvedValue([
        {
          id: 'conn-1',
          userId: 'user-2',
          ws: mockWs,
          status: ConnectionStatus.Connected,
        },
      ]),
    };

    subscriptionRepo = {
      add: vi.fn(),
      remove: vi.fn(),
      findByChannel: vi.fn().mockResolvedValue(['conn-1']),
      findByConnection: vi.fn(),
      removeAllForConnection: vi.fn(),
    };

    useCase = new BroadcastEvent(connectionRepo, subscriptionRepo);
  });

  it('should send event to all channel subscribers', async () => {
    await useCase.execute(testEvent);

    expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(testEvent));
  });

  it('should not send event to non-subscribers', async () => {
    vi.mocked(subscriptionRepo.findByChannel).mockResolvedValue([]);

    await useCase.execute(testEvent);

    expect(mockWs.send).not.toHaveBeenCalled();
  });

  it('should clean up connection on write error', async () => {
    vi.mocked(mockWs.send).mockImplementation(() => {
      throw new Error('Connection closed');
    });

    await useCase.execute(testEvent);

    expect(connectionRepo.deleteById).toHaveBeenCalledWith('conn-1');
    expect(subscriptionRepo.removeAllForConnection).toHaveBeenCalledWith('conn-1');
  });

  it('should skip disconnected connections', async () => {
    vi.mocked(connectionRepo.findAll).mockResolvedValue([
      {
        id: 'conn-disconnected',
        userId: 'user-2',
        ws: mockWs,
        status: ConnectionStatus.Disconnected,
      },
    ]);

    await useCase.execute(testEvent);

    expect(mockWs.send).not.toHaveBeenCalled();
  });
});
