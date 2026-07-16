export interface AuthenticateResult {
  success: boolean;
  connectionId?: string;
  userId?: string;
  error?: string;
}

export interface AuthenticateUseCase {
  execute(token: string, connectionId: string): Promise<AuthenticateResult>;
}
