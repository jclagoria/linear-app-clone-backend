import { ClientMessageSchema, ErrorCode, createErrorMessage, createSubscribedMessage, createUnsubscribedMessage } from '../../domain/message';
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
      return JSON.stringify(createErrorMessage(ErrorCode.INVALID_JSON, 'Invalid JSON'));
    }

    if (typeof parsed !== 'object' || parsed === null) {
      return JSON.stringify(createErrorMessage(ErrorCode.INVALID_MESSAGE_FORMAT, 'Invalid message format'));
    }

    // Check type field exists first
    if (!parsed.type || typeof parsed.type !== 'string') {
      return JSON.stringify(createErrorMessage(ErrorCode.VALIDATION_ERROR, 'Missing or invalid type field'));
    }

    const result = ClientMessageSchema.safeParse(parsed);

    if (!result.success) {
      const issues = result.error.issues;
      if (issues.length > 0) {
        const first = issues[0];
        return JSON.stringify(
          createErrorMessage(
            ErrorCode.VALIDATION_ERROR,
            `${first.path.join('.')} — ${first.message}`,
          ),
        );
      }
      return JSON.stringify(createErrorMessage(ErrorCode.VALIDATION_ERROR, 'Validation error'));
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
        return JSON.stringify(createErrorMessage(ErrorCode.AUTH_FAILED, authResult.error ?? 'Authentication failed'));
      }

      case 'subscribe': {
        const subResult = await this.subscribeUseCase.execute(connectionId, msg.channel);
        if (!subResult.success) {
          return JSON.stringify(createErrorMessage(subResult.error ?? ErrorCode.SUBSCRIBE_FAILED, 'Subscribe failed'));
        }
        return JSON.stringify(createSubscribedMessage(msg.channel));
      }

      case 'unsubscribe': {
        const unsubResult = await this.unsubscribeUseCase.execute(connectionId, msg.channel);
        if (!unsubResult.success) {
          return JSON.stringify(createErrorMessage(unsubResult.error ?? ErrorCode.UNSUBSCRIBE_FAILED, 'Unsubscribe failed'));
        }
        return JSON.stringify(createUnsubscribedMessage(msg.channel));
      }

      case 'ping': {
        return JSON.stringify({ type: 'pong' });
      }

      default:
        return JSON.stringify(createErrorMessage(ErrorCode.UNKNOWN_MESSAGE_TYPE, 'Unknown message type'));
    }
  }
}
