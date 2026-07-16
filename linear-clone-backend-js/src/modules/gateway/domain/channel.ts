export enum ChannelType {
  Team = 'team',
  Issue = 'issue',
  User = 'user',
}

export interface Channel {
  type: ChannelType;
  id: string;
}

const CHANNEL_PATTERN = /^(team|issue|user):(.+)$/;

export function parseChannel(input: string): Channel | null {
  const match = CHANNEL_PATTERN.exec(input);
  if (!match) return null;

  const type = match[1] as ChannelType;
  const id = match[2];

  if (!id) return null;

  return { type, id };
}

export function formatChannel(channel: Channel): string {
  return `${channel.type}:${channel.id}`;
}

export function validateChannel(input: string): boolean {
  return CHANNEL_PATTERN.test(input);
}
