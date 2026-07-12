import { describe, it, expect } from 'vitest';
import { JoseTokenService } from '../adapters/out/token-service';

describe('JoseTokenService', () => {
  const tokenService = new JoseTokenService();

  it('should generate access token', async () => {
    const token = await tokenService.generateAccessToken('user-id-123');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should generate refresh token', async () => {
    const token = await tokenService.generateRefreshToken('user-id-123');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should verify access token', async () => {
    const token = await tokenService.generateAccessToken('user-id-123');
    const result = await tokenService.verifyAccessToken(token);
    expect(result.valid).toBe(true);
    expect(result.userId).toBe('user-id-123');
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it('should reject invalid token', async () => {
    const result = await tokenService.verifyAccessToken('invalid-token');
    expect(result.valid).toBe(false);
  });
});
