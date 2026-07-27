import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MessageHandler } from '../adapters/in/message-handler';
import type { AuthenticateUseCase } from '../application/ports/in/authenticate-use-case';
import type { SubscribeUseCase } from '../application/ports/in/subscribe-use-case';
import type { UnsubscribeUseCase } from '../application/ports/in/unsubscribe-use-case';

describe('MessageHandler', () => {
  let authenticate: AuthenticateUseCase;
  let subscribe: SubscribeUseCase;
  let unsubscribe: UnsubscribeUseCase;
  let handler: MessageHandler;

  beforeEach(() => {
    authenticate = { execute: vi.fn() };
    subscribe = { execute: vi.fn() };
    unsubscribe = { execute: vi.fn() };

    handler = new MessageHandler(authenticate, subscribe, unsubscribe);
  });

  it('should handle authenticate message', async () => {
    vi.mocked(authenticate.execute).mockResolvedValue({
      success: true,
      userId: 'user-1',
      connectionId: 'conn-1',
    });

    const result = await handler.handle(
      JSON.stringify({ type: 'authenticate', token: 'valid-token' }),
      'conn-1',
    );

    expect(result).toBe(
      JSON.stringify({ type: 'authenticated', userId: 'user-1', connectionId: 'conn-1' }),
    );
  });

  it('should handle subscribe message', async () => {
    vi.mocked(subscribe.execute).mockResolvedValue({ success: true });

    const result = await handler.handle(
      JSON.stringify({ type: 'subscribe', channel: 'team:abc' }),
      'conn-1',
    );

    expect(result).toBe(JSON.stringify({ type: 'subscribed', channel: 'team:abc' }));
  });

  it('should handle unsubscribe message', async () => {
    vi.mocked(unsubscribe.execute).mockResolvedValue({ success: true });

    const result = await handler.handle(
      JSON.stringify({ type: 'unsubscribe', channel: 'team:abc' }),
      'conn-1',
    );

    expect(result).toBe(JSON.stringify({ type: 'unsubscribed', channel: 'team:abc' }));
    expect(unsubscribe.execute).toHaveBeenCalledWith('conn-1', 'team:abc');
  });

  it('should handle ping message', async () => {
    const result = await handler.handle(
      JSON.stringify({ type: 'ping' }),
      'conn-1',
    );

    expect(result).toBe(JSON.stringify({ type: 'pong' }));
  });

  it('should return error for invalid JSON', async () => {
    const result = await handler.handle('not json', 'conn-1');

    expect(result).toBe(JSON.stringify({ type: 'error', code: 'invalid_json', message: 'Invalid JSON' }));
  });

  it('should return error for missing type field', async () => {
    const result = await handler.handle(JSON.stringify({}), 'conn-1');

    expect(result).toBe(
      JSON.stringify({ type: 'error', code: 'validation_error', message: 'Missing or invalid type field' }),
    );
  });

  it('should return validation error for unknown message type via Zod', async () => {
    const result = await handler.handle(
      JSON.stringify({ type: 'unknown_type' }),
      'conn-1',
    );

    expect(result).toContain('validation_error');
    expect(result).toContain('Invalid discriminator value');
  });

  it('should handle auth failure', async () => {
    vi.mocked(authenticate.execute).mockResolvedValue({
      success: false,
      error: 'invalid_token',
    });

    const result = await handler.handle(
      JSON.stringify({ type: 'authenticate', token: 'bad-token' }),
      'conn-1',
    );

    expect(result).toBe(JSON.stringify({ type: 'error', code: 'auth_failed', message: 'invalid_token' }));
  });

  it('should handle subscribe failure', async () => {
    vi.mocked(subscribe.execute).mockResolvedValue({
      success: false,
      error: 'forbidden',
    });

    const result = await handler.handle(
      JSON.stringify({ type: 'subscribe', channel: 'team:abc' }),
      'conn-1',
    );

    expect(result).toBe(JSON.stringify({ type: 'error', code: 'forbidden', message: 'Subscribe failed' }));
  });

  it('should handle unsubscribe failure', async () => {
    vi.mocked(unsubscribe.execute).mockResolvedValue({
      success: false,
      error: 'rate_limited',
    });

    const result = await handler.handle(
      JSON.stringify({ type: 'unsubscribe', channel: 'team:abc' }),
      'conn-1',
    );

    expect(result).toBe(JSON.stringify({ type: 'error', code: 'rate_limited', message: 'Unsubscribe failed' }));
  });
});
