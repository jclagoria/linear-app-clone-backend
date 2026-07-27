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
  code: string;
  message: string;
}

export interface PongMessage {
  type: 'pong';
}

export interface SubscribedMessage {
  type: 'subscribed';
  channel: string;
}

export interface UnsubscribedMessage {
  type: 'unsubscribed';
  channel: string;
}

export interface EventMessage {
  type: 'event';
  channel: string;
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
  userId: string;
}

export type ServerMessage =
  | AuthenticatedMessage
  | ErrorMessage
  | PongMessage
  | SubscribedMessage
  | UnsubscribedMessage
  | EventMessage;

// ── Validation Helpers ──

export function createErrorMessage(code: string, message: string): ErrorMessage {
  return { type: 'error', code, message };
}

export function createSubscribedMessage(channel: string): SubscribedMessage {
  return { type: 'subscribed', channel };
}

export function createUnsubscribedMessage(channel: string): UnsubscribedMessage {
  return { type: 'unsubscribed', channel };
}

// ── Error Codes ──

export const ErrorCode = {
  INVALID_JSON: 'invalid_json',
  INVALID_MESSAGE_FORMAT: 'invalid_message_format',
  VALIDATION_ERROR: 'validation_error',
  UNKNOWN_MESSAGE_TYPE: 'unknown_message_type',
  AUTH_FAILED: 'auth_failed',
  INVALID_TOKEN: 'invalid_token',
  SUBSCRIBE_FAILED: 'subscribe_failed',
  UNSUBSCRIBE_FAILED: 'unsubscribe_failed',
  INVALID_CHANNEL: 'invalid_channel',
  FORBIDDEN: 'forbidden',
  CONNECTION_NOT_FOUND: 'connection_not_found',
  UNAUTHENTICATED: 'unauthenticated',
  RATE_LIMITED: 'rate_limited',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
