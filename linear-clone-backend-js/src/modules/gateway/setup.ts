import type { FastifyInstance } from 'fastify';
import Redis from 'ioredis';
import { GatewayWebSocketServer } from './adapters/in/websocket-server';
import { MessageHandler } from './adapters/in/message-handler';
import { InMemoryConnectionRepository } from './adapters/out/in-memory-connection-repository';
import { InMemorySubscriptionRepository } from './adapters/out/in-memory-subscription-repository';
import { RedisOnlineStatus } from './adapters/out/redis-online-status';
import { InProcessEventEmitter } from './adapters/out/in-process-event-emitter';
import { JoseTokenVerifier } from './adapters/out/jwt-token-verifier';
import { WorkToGatewayBridge } from './adapters/out/work-to-gateway-bridge';
import { ModuleChannelValidator } from './adapters/out/module-channel-validator';
import { ConnectionRateLimiter } from './adapters/out/connection-rate-limiter';
import { AuthenticateConnection } from './application/authenticate-connection';
import { ManageSubscription } from './application/manage-subscription';
import { BroadcastEvent } from './application/broadcast-event';
import { HandleDisconnect } from './application/handle-disconnect';
import { env } from '../../shared/config/env';
import { DrizzleTeamQueryPort } from '../identity/adapters/out/drizzle-team-query-port';
import { DrizzleIssueQueryPort } from '../work/adapters/out/drizzle-issue-query-port';

let gatewayServer: GatewayWebSocketServer | null = null;

export function getGatewayServer(): GatewayWebSocketServer | null {
  return gatewayServer;
}

export async function setupGateway(app: FastifyInstance): Promise<void> {
  const redisUrl = env.REDIS_URL;

  let redis: Redis | null = null;
  try {
    redis = new Redis(redisUrl);
    await redis.ping();
  } catch {
    app.log.warn('Redis not available — online status will be disabled');
  }

  // Repositories
  const connectionRepo = new InMemoryConnectionRepository();
  const subscriptionRepo = new InMemorySubscriptionRepository();

  // Online status (Redis or noop fallback)
  const onlineStatus = redis
    ? new RedisOnlineStatus(redis)
    : {
        setOnline: async () => {},
        setOffline: async () => {},
        isOnline: async () => false,
      };

  // Token verification
  const tokenVerifier = new JoseTokenVerifier();

  // Event emitter for cross-module broadcasting
  const eventEmitter = new InProcessEventEmitter();

  // Cross-module query ports
  const teamQueryPort = new DrizzleTeamQueryPort();
  const issueQueryPort = new DrizzleIssueQueryPort();

  // Channel validator for access control
  const channelValidator = new ModuleChannelValidator(teamQueryPort, issueQueryPort);

  // Rate limiter for subscribe/unsubscribe operations
  const rateLimiter = new ConnectionRateLimiter(100, 60 * 1000); // 100 requests per minute

  // Work-to-Gateway event bridge
  const workToGatewayBridge = new WorkToGatewayBridge(eventEmitter);

  // Use cases
  const authenticateConnection = new AuthenticateConnection(
    connectionRepo,
    subscriptionRepo,
    onlineStatus,
    tokenVerifier,
    teamQueryPort,
    issueQueryPort,
  );

  const manageSubscription = new ManageSubscription(
    connectionRepo,
    subscriptionRepo,
    channelValidator,
    rateLimiter,
  );

  const broadcastEvent = new BroadcastEvent(
    connectionRepo,
    subscriptionRepo,
  );

  const handleDisconnect = new HandleDisconnect(
    connectionRepo,
    subscriptionRepo,
    onlineStatus,
  );

  // Message handler
  const messageHandler = new MessageHandler(
    authenticateConnection,
    manageSubscription,
    { execute: (cid, ch) => manageSubscription.executeUnsubscribe(cid, ch) }, // adapt method
  );

  // Parse allowed origins for WebSocket origin validation
  const allowedOrigins: string[] | undefined =
    env.CORS_ORIGINS === '*'
      ? ['*']
      : env.CORS_ORIGINS.split(',').map((o) => o.trim());

  // Start WebSocket server
  gatewayServer = new GatewayWebSocketServer(
    app.server,
    messageHandler,
    handleDisconnect,
    broadcastEvent,
    eventEmitter,
    env.WS_AUTH_TIMEOUT_MS,
    env.WS_MAX_CONNECTIONS,
    allowedOrigins,
  );

  app.log.info('Gateway WebSocket server initialized');

  // Export the bridge for work module integration
  app.decorate('workToGatewayBridge', workToGatewayBridge);
}

// Type augmentation for FastifyInstance
declare module 'fastify' {
  interface FastifyInstance {
    workToGatewayBridge: WorkToGatewayBridge;
  }
}
