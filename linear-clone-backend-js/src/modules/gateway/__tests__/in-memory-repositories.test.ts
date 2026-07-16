import { describe, it, expect } from 'vitest';
import { InMemoryConnectionRepository } from '../adapters/out/in-memory-connection-repository';
import { InMemorySubscriptionRepository } from '../adapters/out/in-memory-subscription-repository';
import { ConnectionStatus } from '../domain/connection';

describe('InMemoryConnectionRepository', () => {
  it('should save and find connection by id', async () => {
    const repo = new InMemoryConnectionRepository();
    const connection = {
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    };

    await repo.save(connection);
    const found = await repo.findById('conn-1');

    expect(found).toEqual(connection);
  });

  it('should return null for unknown id', async () => {
    const repo = new InMemoryConnectionRepository();
    const found = await repo.findById('unknown');

    expect(found).toBeNull();
  });

  it('should delete connection by id', async () => {
    const repo = new InMemoryConnectionRepository();
    const connection = {
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    };

    await repo.save(connection);
    await repo.deleteById('conn-1');
    const found = await repo.findById('conn-1');

    expect(found).toBeNull();
  });

  it('should find connections by user id', async () => {
    const repo = new InMemoryConnectionRepository();

    await repo.save({
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });

    await repo.save({
      id: 'conn-2',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });

    await repo.save({
      id: 'conn-3',
      userId: 'user-2',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });

    const user1Connections = await repo.findByUserId('user-1');
    expect(user1Connections).toHaveLength(2);

    const user2Connections = await repo.findByUserId('user-2');
    expect(user2Connections).toHaveLength(1);
  });

  it('should return all connections', async () => {
    const repo = new InMemoryConnectionRepository();

    await repo.save({
      id: 'conn-1',
      userId: 'user-1',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });

    await repo.save({
      id: 'conn-2',
      userId: 'user-2',
      ws: null as any,
      status: ConnectionStatus.Connected,
    });

    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });
});

describe('InMemorySubscriptionRepository', () => {
  it('should add and find subscriptions by channel', async () => {
    const repo = new InMemorySubscriptionRepository();

    await repo.add('conn-1', 'team:abc');
    await repo.add('conn-2', 'team:abc');

    const subscribers = await repo.findByChannel('team:abc');
    expect(subscribers).toEqual(['conn-1', 'conn-2']);
  });

  it('should remove subscription', async () => {
    const repo = new InMemorySubscriptionRepository();

    await repo.add('conn-1', 'team:abc');
    await repo.add('conn-2', 'team:abc');
    await repo.remove('conn-1', 'team:abc');

    const subscribers = await repo.findByChannel('team:abc');
    expect(subscribers).toEqual(['conn-2']);
  });

  it('should find subscriptions by connection', async () => {
    const repo = new InMemorySubscriptionRepository();

    await repo.add('conn-1', 'team:abc');
    await repo.add('conn-1', 'issue:123');

    const channels = await repo.findByConnection('conn-1');
    expect(channels).toEqual(['team:abc', 'issue:123']);
  });

  it('should remove all subscriptions for a connection', async () => {
    const repo = new InMemorySubscriptionRepository();

    await repo.add('conn-1', 'team:abc');
    await repo.add('conn-1', 'issue:123');
    await repo.add('conn-2', 'team:abc');

    await repo.removeAllForConnection('conn-1');

    const conn1Channels = await repo.findByConnection('conn-1');
    expect(conn1Channels).toHaveLength(0);

    // conn-2 subscription should remain
    const subscribers = await repo.findByChannel('team:abc');
    expect(subscribers).toEqual(['conn-2']);
  });
});
