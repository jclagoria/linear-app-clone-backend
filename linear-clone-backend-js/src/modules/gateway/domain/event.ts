export interface GatewayEvent {
  type: 'event';
  channel: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  userId: string;
}

export function createGatewayEvent(
  channel: string,
  eventName: string,
  data: Record<string, unknown>,
  userId: string,
): GatewayEvent {
  return {
    type: 'event',
    channel,
    event: eventName,
    data,
    timestamp: new Date().toISOString(),
    userId,
  };
}
