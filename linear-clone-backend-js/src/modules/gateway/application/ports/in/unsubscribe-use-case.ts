export interface UnsubscribeUseCase {
  execute(connectionId: string, channel: string): Promise<{ success: boolean; error?: string }>;
}
