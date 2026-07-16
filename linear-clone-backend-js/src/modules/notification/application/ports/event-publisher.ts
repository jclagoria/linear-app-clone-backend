export interface NotificationEvent {
  type: string;
  userId: string;
  timestamp: Date;
  payload: Record<string, unknown>;
}

export interface NotificationEventPublisher {
  publish(event: NotificationEvent): Promise<void>;
}
