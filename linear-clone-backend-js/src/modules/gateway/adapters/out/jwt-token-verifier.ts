import { jwtVerify } from 'jose';
import { env } from '../../../../shared/config/env';
import type { TokenVerifier } from '../../application/ports/out/token-verifier';

const secret = new TextEncoder().encode(env.JWT_SECRET);

export class JoseTokenVerifier implements TokenVerifier {
  async verify(
    token: string,
  ): Promise<{ valid: boolean; userId?: string }> {
    try {
      const { payload } = await jwtVerify(token, secret);

      if (payload.type !== 'access') {
        return { valid: false };
      }

      return {
        valid: true,
        userId: payload.sub as string,
      };
    } catch {
      return { valid: false };
    }
  }
}
