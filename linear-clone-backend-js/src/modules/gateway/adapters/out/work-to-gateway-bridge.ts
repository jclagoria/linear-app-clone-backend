import type { Event, EventPublisher } from '../../../work/application/ports/event-publisher';
import type { InProcessEventEmitter } from './in-process-event-emitter';
import { createGatewayEvent, type GatewayEvent } from '../../domain/event';
import { formatChannel, ChannelType } from '../../domain/channel';

/**
 * Bridge adapter that implements the work module's EventPublisher port
 * and forwards events to the gateway's InProcessEventEmitter for WebSocket broadcast.
 *
 * This enables real-time updates for work module events (issues, comments, labels, watchers).
 */
export class WorkToGatewayBridge implements EventPublisher {
  constructor(private readonly eventEmitter: InProcessEventEmitter) {}

  async publish(event: Event): Promise<void> {
    const gatewayEvent = this.mapToGatewayEvent(event);
    if (gatewayEvent) {
      await this.eventEmitter.broadcast(gatewayEvent);
    }
  }

  private mapToGatewayEvent(event: Event): GatewayEvent | null {
    const channel = this.determineChannel(event);
    if (!channel) {
      return null;
    }

    const eventName = this.mapEventType(event.type);
    if (!eventName) {
      return null;
    }

    const data = this.extractEventData(event);
    return createGatewayEvent(channel, eventName, data, event.userId);
  }

  private determineChannel(event: Event): string | null {
    const { type } = event;

    // Issue events → team channel
    if (type.startsWith('issue.')) {
      const teamId = event.teamId as string | undefined;
      if (!teamId) {
        return null;
      }
      return formatChannel({ type: ChannelType.Team, id: teamId });
    }

    // Comment events → issue channel
    if (type.startsWith('comment.')) {
      const issueId = event.issueId as string | undefined;
      if (!issueId) {
        return null;
      }
      return formatChannel({ type: ChannelType.Issue, id: issueId });
    }

    // Label events → team channel
    if (type.startsWith('label.')) {
      const teamId = event.teamId as string | undefined;
      if (!teamId) {
        return null;
      }
      return formatChannel({ type: ChannelType.Team, id: teamId });
    }

    // Watcher events → issue channel
    if (type.startsWith('watcher.')) {
      const issueId = event.issueId as string | undefined;
      if (!issueId) {
        return null;
      }
      return formatChannel({ type: ChannelType.Issue, id: issueId });
    }

    return null;
  }

  private mapEventType(workEventType: string): string | null {
    // Map work event types to gateway event names
    const eventMap: Record<string, string> = {
      'issue.created': 'issue.created',
      'issue.updated': 'issue.updated',
      'issue.deleted': 'issue.deleted',
      'comment.created': 'comment.created',
      'comment.updated': 'comment.updated',
      'comment.deleted': 'comment.deleted',
      'label.created': 'label.created',
      'label.updated': 'label.updated',
      'label.deleted': 'label.deleted',
      'watcher.added': 'watcher.added',
      'watcher.removed': 'watcher.removed',
    };

    return eventMap[workEventType] ?? null;
  }

  private extractEventData(event: Event): Record<string, unknown> {
    const { type, userId, timestamp, ...rest } = event;
    return {
      ...rest,
      timestamp: timestamp.toISOString(),
    };
  }
}
