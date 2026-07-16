import { z } from 'zod';

// ── Client → Server Messages ──

export const AuthenticateMessageSchema = z.object({
  type: z.literal('authenticate'),
  token: z.string().min(1),
});

export const SubscribeMessageSchema = z.object({
  type: z.literal('subscribe'),
  channel: z.string().min(1),
});

export const UnsubscribeMessageSchema = z.object({
  type: z.literal('unsubscribe'),
  channel: z.string().min(1),
});

export const PingMessageSchema = z.object({
  type: z.literal('ping'),
});

export const ClientMessageSchema = z.discriminatedUnion('type', [
  AuthenticateMessageSchema,
  SubscribeMessageSchema,
  UnsubscribeMessageSchema,
  PingMessageSchema,
]);

export type AuthenticateMessage = z.infer<typeof AuthenticateMessageSchema>;
export type SubscribeMessage = z.infer<typeof SubscribeMessageSchema>;
export type UnsubscribeMessage = z.infer<typeof UnsubscribeMessageSchema>;
export type PingMessage = z.infer<typeof PingMessageSchema>;
export type ClientMessage = z.infer<typeof ClientMessageSchema>;

// ── Server → Client Messages ──

export interface AuthenticatedMessage {
  type: 'authenticated';
  userId: string;
  connectionId: string;
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

export interface PongMessage {
  type: 'pong';
}

export interface EventMessage {
  type: 'event';
  channel: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  userId: string;
}

export type ServerMessage = AuthenticatedMessage | ErrorMessage | PongMessage | EventMessage;
