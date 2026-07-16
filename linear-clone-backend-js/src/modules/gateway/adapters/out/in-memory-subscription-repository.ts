import type { SubscriptionRepository } from '../../application/ports/out/subscription-repository';

export class InMemorySubscriptionRepository implements SubscriptionRepository {
  // channel -> Set<connectionId>
  private readonly channelIndex = new Map<string, Set<string>>();
  // connectionId -> Set<channel>
  private readonly connectionIndex = new Map<string, Set<string>>();

  async add(connectionId: string, channel: string): Promise<void> {
    // Index by channel
    if (!this.channelIndex.has(channel)) {
      this.channelIndex.set(channel, new Set());
    }
    this.channelIndex.get(channel)!.add(connectionId);

    // Index by connection
    if (!this.connectionIndex.has(connectionId)) {
      this.connectionIndex.set(connectionId, new Set());
    }
    this.connectionIndex.get(connectionId)!.add(channel);
  }

  async remove(connectionId: string, channel: string): Promise<void> {
    this.channelIndex.get(channel)?.delete(connectionId);
    if (this.channelIndex.get(channel)?.size === 0) {
      this.channelIndex.delete(channel);
    }

    this.connectionIndex.get(connectionId)?.delete(channel);
    if (this.connectionIndex.get(connectionId)?.size === 0) {
      this.connectionIndex.delete(connectionId);
    }
  }

  async findByChannel(channel: string): Promise<string[]> {
    return Array.from(this.channelIndex.get(channel) ?? []);
  }

  async findByConnection(connectionId: string): Promise<string[]> {
    return Array.from(this.connectionIndex.get(connectionId) ?? []);
  }

  async removeAllForConnection(connectionId: string): Promise<void> {
    const channels = this.connectionIndex.get(connectionId);
    if (!channels) return;

    for (const channel of channels) {
      this.channelIndex.get(channel)?.delete(connectionId);
    }

    this.connectionIndex.delete(connectionId);
  }
}
