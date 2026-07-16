import { v4 as uuidv4 } from 'uuid';
import type { ConnectionRepository } from './ports/out/connection-repository';
import type { SubscriptionRepository } from './ports/out/subscription-repository';
import type { OnlineStatus } from './ports/out/online-status';
import type { TokenVerifier } from './ports/out/token-verifier';
import type { AuthenticateUseCase, AuthenticateResult } from './ports/in/authenticate-use-case';
import { ConnectionStatus } from '../domain/connection';
import { formatChannel } from '../domain/channel';
import { ChannelType } from '../domain/channel';
import type WebSocket from 'ws';

export class AuthenticateConnection implements AuthenticateUseCase {
  constructor(
    private readonly connectionRepo: ConnectionRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly onlineStatus: OnlineStatus,
    private readonly tokenVerifier: TokenVerifier,
  ) {}

  async execute(token: string, connectionId: string): Promise<AuthenticateResult> {
    const verification = await this.tokenVerifier.verify(token);

    if (!verification.valid || !verification.userId) {
      return { success: false, error: 'invalid_token' };
    }

    const connection = {
      id: connectionId,
      userId: verification.userId,
      ws: null as unknown as WebSocket,
      status: ConnectionStatus.Connected,
    };

    await this.connectionRepo.save(connection);

    // Auto-subscribe to user's personal channel
    const userChannel = formatChannel({ type: ChannelType.User, id: verification.userId });
    await this.subscriptionRepo.add(connectionId, userChannel);

    // Mark user online
    await this.onlineStatus.setOnline(verification.userId);

    return {
      success: true,
      connectionId,
      userId: verification.userId,
    };
  }
}
