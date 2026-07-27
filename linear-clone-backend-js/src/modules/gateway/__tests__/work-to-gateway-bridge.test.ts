import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorkToGatewayBridge } from '../adapters/out/work-to-gateway-bridge';
import type { InProcessEventEmitter } from '../adapters/out/in-process-event-emitter';
import type { Event } from '../../work/application/ports/event-publisher';

describe('WorkToGatewayBridge', () => {
  let eventEmitter: InProcessEventEmitter;
  let bridge: WorkToGatewayBridge;

  beforeEach(() => {
    eventEmitter = {
      emitter: new (require('events').EventEmitter)(),
      on: vi.fn(),
      off: vi.fn(),
      broadcast: vi.fn(),
    } as any;
    bridge = new WorkToGatewayBridge(eventEmitter);
  });

  describe('event type mapping', () => {
    it('should map issue.created to gateway event', async () => {
      const event: Event = {
        type: 'issue.created',
        userId: 'user-1',
        timestamp: new Date(),
        teamId: 'team-1',
        issueId: 'issue-1',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'event',
          event: 'issue.created',
          channel: 'team:team-1',
          userId: 'user-1',
        }),
      );
    });

    it('should map comment.created to gateway event', async () => {
      const event: Event = {
        type: 'comment.created',
        userId: 'user-1',
        timestamp: new Date(),
        issueId: 'issue-1',
        commentId: 'comment-1',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'event',
          event: 'comment.created',
          channel: 'issue:issue-1',
          userId: 'user-1',
        }),
      );
    });

    it('should map label.created to gateway event', async () => {
      const event: Event = {
        type: 'label.created',
        userId: 'user-1',
        timestamp: new Date(),
        teamId: 'team-1',
        labelId: 'label-1',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'event',
          event: 'label.created',
          channel: 'team:team-1',
          userId: 'user-1',
        }),
      );
    });

    it('should map watcher.added to gateway event', async () => {
      const event: Event = {
        type: 'watcher.added',
        userId: 'user-1',
        timestamp: new Date(),
        issueId: 'issue-1',
        watcherUserId: 'watcher-1',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'event',
          event: 'watcher.added',
          channel: 'issue:issue-1',
          userId: 'user-1',
        }),
      );
    });
  });

  describe('channel determination', () => {
    it('should use team channel for issue events', async () => {
      const event: Event = {
        type: 'issue.updated',
        userId: 'user-1',
        timestamp: new Date(),
        teamId: 'team-1',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'team:team-1',
        }),
      );
    });

    it('should use issue channel for comment events', async () => {
      const event: Event = {
        type: 'comment.updated',
        userId: 'user-1',
        timestamp: new Date(),
        issueId: 'issue-1',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'issue:issue-1',
        }),
      );
    });

    it('should return null for unknown event types', async () => {
      const event: Event = {
        type: 'unknown.event',
        userId: 'user-1',
        timestamp: new Date(),
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).not.toHaveBeenCalled();
    });

    it('should return null for issue events without teamId', async () => {
      const event: Event = {
        type: 'issue.created',
        userId: 'user-1',
        timestamp: new Date(),
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).not.toHaveBeenCalled();
    });

    it('should return null for comment events without issueId', async () => {
      const event: Event = {
        type: 'comment.created',
        userId: 'user-1',
        timestamp: new Date(),
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).not.toHaveBeenCalled();
    });
  });

  describe('event data extraction', () => {
    it('should include event data in gateway event', async () => {
      const event: Event = {
        type: 'issue.created',
        userId: 'user-1',
        timestamp: new Date(),
        teamId: 'team-1',
        issueId: 'issue-1',
        title: 'Test Issue',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            teamId: 'team-1',
            issueId: 'issue-1',
            title: 'Test Issue',
          }),
        }),
      );
    });

    it('should convert timestamp to ISO string', async () => {
      const timestamp = new Date('2024-01-01T00:00:00Z');
      const event: Event = {
        type: 'issue.created',
        userId: 'user-1',
        timestamp,
        teamId: 'team-1',
      };

      await bridge.publish(event);

      expect(eventEmitter.broadcast).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            timestamp: '2024-01-01T00:00:00.000Z',
          }),
        }),
      );
    });
  });
});
