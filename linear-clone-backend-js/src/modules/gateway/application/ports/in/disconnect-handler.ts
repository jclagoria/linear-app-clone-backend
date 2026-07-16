export interface DisconnectHandler {
  handleDisconnect(connectionId: string): Promise<void>;
}
