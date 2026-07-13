import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { InMemoryStore } from './in-memory-store';
import { RateLimitError } from '../errors';

interface RateLimitOptions {
  max: number;
  windowMs: number;
  keyGenerator?: (request: FastifyRequest) => string;
}

const defaultKeyGenerator = (request: FastifyRequest): string => {
  const forwarded = request.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    return ips.split(',')[0].trim();
  }
  return request.ip || 'unknown';
};

export async function rateLimitPlugin(
  fastify: FastifyInstance,
  options: RateLimitOptions
) {
  const store = new InMemoryStore();
  const keyGenerator = options.keyGenerator || defaultKeyGenerator;

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const key = `${keyGenerator(request)}:${request.url}`;
    const { count, ttl } = await store.increment(key, options.windowMs);

    reply.header('X-RateLimit-Limit', options.max);
    reply.header('X-RateLimit-Remaining', Math.max(0, options.max - count));

    if (count > options.max) {
      const retryAfter = Math.ceil(ttl / 1000);
      reply.header('Retry-After', retryAfter);
      throw new RateLimitError();
    }
  });
}

export function createRateLimitOptions(opts: Partial<RateLimitOptions> = {}): RateLimitOptions {
  return {
    max: opts.max || 100,
    windowMs: opts.windowMs || 60 * 1000,
    keyGenerator: opts.keyGenerator,
  };
}
