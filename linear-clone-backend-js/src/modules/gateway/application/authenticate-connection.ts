import { v4 as uuidv4 } from 'uuid';
import type { ConnectionRepository } from './ports/out/connection-repository';
import type { SubscriptionRepository } from './ports/out/subscription-repository';
import type { OnlineStatus } from './ports/out/online-status';
import type { TokenVerifier } from './ports/out/token-verifier';
import type { AuthenticateUseCase, AuthenticateResult } from './ports/in/authenticate-use-case';
import type { TeamQueryPort } from '../../identity/application/ports/out/team-query-port';
import type { IssueQueryPort } from '../../work/application/ports/out/issue-query-port';
import { ConnectionStatus } from '../domain/connection';
import { autoSubscribeUserChannels } from './auto-subscription';
import type WebSocket from 'ws';

export class AuthenticateConnection implements AuthenticateUseCase {
  constructor(
    private readonly connectionRepo: ConnectionRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly onlineStatus: OnlineStatus,
    private readonly tokenVerifier: TokenVerifier,
    private readonly teamQueryPort: TeamQueryPort,
    private readonly issueQueryPort: IssueQueryPort,
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

    // Auto-subscribe to user's channels (user, team, issue channels)
    try {
      const [teamIds, issueIds] = await Promise.all([
        this.teamQueryPort.getUserTeamIds(verification.userId),
        this.issueQueryPort.getUserIssueIds(verification.userId),
      ]);

      await autoSubscribeUserChannels(connectionId, verification.userId, this.subscriptionRepo, {
        teamIds,
        issueIds,
      });
    } catch (error) {
      // Gracefully handle query failures - log warning but continue
      // User will still be subscribed to their personal channel
      console.warn('Failed to fetch team/issue IDs for auto-subscription:', error);
    }

    // Mark user online
    await this.onlineStatus.setOnline(verification.userId);

    return {
      success: true,
      connectionId,
      userId: verification.userId,
    };
  }
}
