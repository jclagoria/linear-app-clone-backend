export interface CycleEvent {
  type: string;
  userId: string;
  timestamp: Date;
  [key: string]: unknown;
}

export interface CycleEventPublisher {
  publish(event: CycleEvent): Promise<void>;
}
