export interface ProjectEvent {
  type: string;
  userId: string;
  timestamp: Date;
  [key: string]: unknown;
}

export interface ProjectEventPublisher {
  publish(event: ProjectEvent): Promise<void>;
}
