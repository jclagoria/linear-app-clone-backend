import type { ChannelValidator } from '../../application/ports/in/channel-validator';
import type { TeamQueryPort } from '../../../identity/application/ports/out/team-query-port';
import type { IssueQueryPort } from '../../../work/application/ports/out/issue-query-port';
import { parseChannel, ChannelType } from '../../domain/channel';

/**
 * Adapter that validates channel access by querying module ports.
 * Implements the ChannelValidator port for the gateway module.
 */
export class ModuleChannelValidator implements ChannelValidator {
  constructor(
    private readonly teamQueryPort: TeamQueryPort,
    private readonly issueQueryPort: IssueQueryPort,
  ) {}

  async validateChannelAccess(userId: string, channel: string): Promise<boolean> {
    const parsed = parseChannel(channel);
    if (!parsed) {
      return false;
    }

    switch (parsed.type) {
      case ChannelType.Team:
        return this.teamQueryPort.isUserMember(userId, parsed.id);

      case ChannelType.Issue:
        return this.issueQueryPort.isUserWatchingOrAssigned(userId, parsed.id);

      case ChannelType.User:
        // Users can only subscribe to their own user channel
        return parsed.id === userId;

      default:
        // Unknown channel type
        return false;
    }
  }
}
