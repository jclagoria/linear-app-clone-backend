export interface SubscribeUseCase {
  execute(connectionId: string, channel: string): Promise<{ success: boolean; error?: string }>;
}
