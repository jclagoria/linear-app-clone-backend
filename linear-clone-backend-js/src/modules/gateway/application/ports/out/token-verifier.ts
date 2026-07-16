export interface TokenVerifier {
  verify(token: string): Promise<{ valid: boolean; userId?: string }>;
}
