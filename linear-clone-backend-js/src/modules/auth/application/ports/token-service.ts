export interface TokenService {
  generateAccessToken(userId: string): Promise<string>;
  generateRefreshToken(userId: string): Promise<string>;
  verifyAccessToken(token: string): Promise<{ valid: boolean; userId?: string; expiresAt?: Date }>;
  verifyRefreshToken(
    token: string,
  ): Promise<{ valid: boolean; userId?: string; jti?: string; expiresAt?: Date }>;
}
