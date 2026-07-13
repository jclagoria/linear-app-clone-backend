import { jwtVerify } from 'jose';
import { env } from '../../../../shared/config/env';

const secret = new TextEncoder().encode(env.JWT_SECRET);

export class JoseTokenService {
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
}
