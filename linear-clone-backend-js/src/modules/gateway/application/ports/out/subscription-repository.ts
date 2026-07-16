export interface SubscriptionRepository {
  add(connectionId: string, channel: string): Promise<void>;
  remove(connectionId: string, channel: string): Promise<void>;
  findByChannel(channel: string): Promise<string[]>;
  findByConnection(connectionId: string): Promise<string[]>;
  removeAllForConnection(connectionId: string): Promise<void>;
}
