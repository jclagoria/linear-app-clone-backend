import type WebSocket from 'ws';

export enum ConnectionStatus {
  Authenticating = 'authenticating',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface Connection {
  id: string;
  userId: string;
  ws: WebSocket;
  status: ConnectionStatus;
}
