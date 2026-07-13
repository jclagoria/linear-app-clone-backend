import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from '../../application/ports/token-service';
import { env } from '../../../../shared/config/env';

const secret = new TextEncoder().encode(env.JWT_SECRET);

export class JoseTokenService implements TokenService {
  async generateAccessToken(userId: string, sessionId?: string): Promise<string> {
    const payload: Record<string, unknown> = { sub: userId, type: 'access' };
    if (sessionId) {
      payload.sid = sessionId;
    }

    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(env.JWT_ACCESS_EXPIRY)
      .setJti(uuidv4())
      .sign(secret);
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return new SignJWT({ sub: userId, type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(env.JWT_REFRESH_EXPIRY)
      .setJti(uuidv4())
      .sign(secret);
  }

  async verifyAccessToken(
    token: string,
  ): Promise<{ valid: boolean; userId?: string; sessionId?: string; expiresAt?: Date }> {
    try {
      const { payload } = await jwtVerify(token, secret);

      if (payload.type !== 'access') {
        return { valid: false };
      }

      return {
        valid: true,
        userId: payload.sub as string,
        sessionId: payload.sid as string | undefined,
        expiresAt: new Date(payload.exp! * 1000),
      };
    } catch {
      return { valid: false };
    }
  }

  async verifyRefreshToken(
    token: string,
  ): Promise<{ valid: boolean; userId?: string; jti?: string; expiresAt?: Date }> {
    try {
      const { payload } = await jwtVerify(token, secret);

      if (payload.type !== 'refresh') {
        return { valid: false };
      }

      return {
        valid: true,
        userId: payload.sub as string,
        jti: payload.jti as string,
        expiresAt: new Date(payload.exp! * 1000),
      };
    } catch {
      return { valid: false };
    }
  }
}
