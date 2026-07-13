import { FastifyRequest, FastifyReply } from 'fastify';
import { JoseTokenService } from '../out/token-service';

const tokenService = new JoseTokenService();

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  const token = authHeader.substring(7);
  const tokenResult = await tokenService.verifyAccessToken(token);

  if (!tokenResult.valid || !tokenResult.userId) {
    return reply.status(401).send({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired access token',
      },
    });
  }

  // Attach userId to request for downstream use
  (request as any).userId = tokenResult.userId;
}
