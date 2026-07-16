import { WebSocketServer as WsServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import type { IncomingMessage } from 'http';
import type { Server } from 'http';
import { MessageHandler } from './message-handler';
import { HandleDisconnect } from '../../application/handle-disconnect';
import { BroadcastEvent } from '../../application/broadcast-event';
import { InProcessEventEmitter } from '../out/in-process-event-emitter';
import type { GatewayEvent } from '../../domain/event';

export class GatewayWebSocketServer {
  private readonly wss: WsServer;
  private readonly authTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly connectionIdMap = new Map<WebSocket, string>();
  private connectionCount = 0;

  constructor(
    server: Server,
    private readonly messageHandler: MessageHandler,
    private readonly handleDisconnect: HandleDisconnect,
    private readonly broadcastEvent: BroadcastEvent,
    private readonly eventEmitter: InProcessEventEmitter,
    private readonly authTimeoutMs: number = 5000,
    private readonly maxConnections: number = 1000,
    allowedOrigins?: string[],
  ) {
    this.wss = new WsServer({
      server,
      path: '/ws',
      maxPayload: 100 * 1024,
      handleProtocols: (protocols) => {
        // Accept any sub-protocol the client sends, or default to none
        return protocols.values().next().value || false;
      },
      verifyClient: (info, cb) => {
        // Connection limit check
        if (this.connectionCount >= this.maxConnections) {
          cb(false, 503, 'Server is at maximum connection capacity');
          return;
        }

        // Origin validation
        if (allowedOrigins && allowedOrigins.length > 0) {
          const origin = info.origin || info.req.headers.origin;
          if (origin && !allowedOrigins.includes('*') && !allowedOrigins.includes(origin)) {
            cb(false, 403, 'Origin not allowed');
            return;
          }
        }

        cb(true);
      },
    });

    this.wss.on('connection', (ws: WebSocket, _req: IncomingMessage) => {
      this.connectionCount++;
      const connectionId = uuidv4();
      this.connectionIdMap.set(ws, connectionId);

      // Set auth timeout
      const timeout = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'error', message: 'auth_timeout' }));
          ws.close();
        }
        this.authTimeouts.delete(connectionId);
        this.connectionIdMap.delete(ws);
      }, this.authTimeoutMs);

      this.authTimeouts.set(connectionId, timeout);

      ws.on('message', async (data: Buffer) => {
        const raw = data.toString();

        const response = await this.messageHandler.handle(raw, connectionId);

        if (response !== null && ws.readyState === WebSocket.OPEN) {
          ws.send(response);

          // If authenticated, clear auth timeout
          const parsed = JSON.parse(response);
          if (parsed.type === 'authenticated') {
            const timeout = this.authTimeouts.get(connectionId);
            if (timeout) {
              clearTimeout(timeout);
              this.authTimeouts.delete(connectionId);
            }
          }

          // If error after auth attempt, close connection
          if (parsed.type === 'error' && parsed.message !== 'auth_timeout') {
            ws.close();
          }
        }
      });

      ws.on('close', async () => {
        this.connectionCount--;
        const timeout = this.authTimeouts.get(connectionId);
        if (timeout) {
          clearTimeout(timeout);
          this.authTimeouts.delete(connectionId);
        }

        await this.handleDisconnect.execute(connectionId);
        this.connectionIdMap.delete(ws);
      });

      ws.on('error', () => {
        // Error handling is done in the close event
      });
    });

    // Listen for events from other modules via the event emitter
    this.eventEmitter.on((event: GatewayEvent) => {
      this.broadcastEvent.execute(event);
    });
  }

  getConnectionId(ws: WebSocket): string | undefined {
    return this.connectionIdMap.get(ws);
  }

  getConnectionCount(): number {
    return this.connectionCount;
  }

  async shutdown(): Promise<void> {
    for (const timeout of this.authTimeouts.values()) {
      clearTimeout(timeout);
    }
    this.authTimeouts.clear();

    return new Promise((resolve) => {
      this.wss.close(() => resolve());
    });
  }
}
