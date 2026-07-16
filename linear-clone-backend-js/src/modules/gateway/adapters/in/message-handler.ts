import { ClientMessageSchema } from '../../domain/message';
import type { AuthenticateUseCase } from '../../application/ports/in/authenticate-use-case';
import type { SubscribeUseCase } from '../../application/ports/in/subscribe-use-case';
import type { UnsubscribeUseCase } from '../../application/ports/in/unsubscribe-use-case';

export class MessageHandler {
  constructor(
    private readonly authenticateUseCase: AuthenticateUseCase,
    private readonly subscribeUseCase: SubscribeUseCase,
    private readonly unsubscribeUseCase: UnsubscribeUseCase,
  ) {}

  async handle(raw: string, connectionId: string): Promise<string | null> {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return JSON.stringify({ type: 'error', message: 'invalid_json' });
    }

    if (typeof parsed !== 'object' || parsed === null) {
      return JSON.stringify({ type: 'error', message: 'invalid_message_format' });
    }

    // Check type field exists first
    if (!parsed.type || typeof parsed.type !== 'string') {
      return JSON.stringify({ type: 'error', message: 'validation_error: missing or invalid type field' });
    }

    const result = ClientMessageSchema.safeParse(parsed);

    if (!result.success) {
      const issues = result.error.issues;
      if (issues.length > 0) {
        const first = issues[0];
        return JSON.stringify({
          type: 'error',
          message: `validation_error: ${first.path.join('.')} — ${first.message}`,
        });
      }
      return JSON.stringify({ type: 'error', message: 'validation_error' });
    }

    const msg = result.data;

    switch (msg.type) {
      case 'authenticate': {
        const authResult = await this.authenticateUseCase.execute(msg.token, connectionId);
        if (authResult.success) {
          return JSON.stringify({
            type: 'authenticated',
            userId: authResult.userId,
            connectionId: authResult.connectionId,
          });
        }
        return JSON.stringify({ type: 'error', message: authResult.error ?? 'auth_failed' });
      }

      case 'subscribe': {
        const subResult = await this.subscribeUseCase.execute(connectionId, msg.channel);
        if (!subResult.success) {
          return JSON.stringify({ type: 'error', message: subResult.error ?? 'subscribe_failed' });
        }
        // No explicit ack on successful subscribe
        return null;
      }

      case 'unsubscribe': {
        await this.unsubscribeUseCase.execute(connectionId, msg.channel);
        return null;
      }

      case 'ping': {
        return JSON.stringify({ type: 'pong' });
      }

      default:
        return JSON.stringify({ type: 'error', message: 'unknown_message_type' });
    }
  }
}
