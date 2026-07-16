import type { FastifyInstance } from 'fastify';
import Redis from 'ioredis';
import { GatewayWebSocketServer } from './adapters/in/websocket-server';
import { MessageHandler } from './adapters/in/message-handler';
import { InMemoryConnectionRepository } from './adapters/out/in-memory-connection-repository';
import { InMemorySubscriptionRepository } from './adapters/out/in-memory-subscription-repository';
import { RedisOnlineStatus } from './adapters/out/redis-online-status';
import { InProcessEventEmitter } from './adapters/out/in-process-event-emitter';
import { JoseTokenVerifier } from './adapters/out/jwt-token-verifier';
import { AuthenticateConnection } from './application/authenticate-connection';
import { ManageSubscription } from './application/manage-subscription';
import { BroadcastEvent } from './application/broadcast-event';
import { HandleDisconnect } from './application/handle-disconnect';
import { env } from '../../shared/config/env';

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

  // Use cases
  const authenticateConnection = new AuthenticateConnection(
    connectionRepo,
    subscriptionRepo,
    onlineStatus,
    tokenVerifier,
  );

  const manageSubscription = new ManageSubscription(
    connectionRepo,
    subscriptionRepo,
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
}
