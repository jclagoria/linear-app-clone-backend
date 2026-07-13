export interface Event {
  type: string;
  userId: string;
  timestamp: Date;
  [key: string]: unknown;
}

export interface EventPublisher {
  publish(event: Event): Promise<void>;
}
