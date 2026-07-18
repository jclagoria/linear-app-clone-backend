import { FastifyReply, FastifyRequest } from 'fastify';
import { env } from './config/env';

export const REFRESH_COOKIE_NAME = 'refreshToken';

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.REFRESH_COOKIE_SECURE,
  sameSite: 'strict' as const,
  path: '/api/v1/auth/refresh',
  maxAge: {
    default: 604800, // 7 days
    rememberMe: 2592000, // 30 days
  },
};

/**
 * Sets the refresh token as an HttpOnly cookie on the response.
 * @param reply - Fastify reply object
 * @param token - The refresh token to set
 * @param rememberMe - If true, extends cookie Max-Age to 30 days
 */
export function setRefreshTokenCookie(
  reply: FastifyReply,
  token: string,
  rememberMe: boolean = false,
): void {
  reply.setCookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: REFRESH_COOKIE_OPTIONS.httpOnly,
    secure: REFRESH_COOKIE_OPTIONS.secure,
    sameSite: REFRESH_COOKIE_OPTIONS.sameSite,
    path: REFRESH_COOKIE_OPTIONS.path,
    maxAge: rememberMe
      ? REFRESH_COOKIE_OPTIONS.maxAge.rememberMe
      : REFRESH_COOKIE_OPTIONS.maxAge.default,
  });
}

/**
 * Clears the refresh token cookie by setting Max-Age=0.
 * @param reply - Fastify reply object
 */
export function clearRefreshTokenCookie(reply: FastifyReply): void {
  reply.clearCookie(REFRESH_COOKIE_NAME, {
    path: REFRESH_COOKIE_OPTIONS.path,
  });
}

/**
 * Reads the refresh token from the request cookies.
 * @param request - Fastify request object
 * @returns The refresh token string if present, undefined otherwise
 */
export function getRefreshTokenCookie(request: FastifyRequest): string | undefined {
  return request.cookies?.[REFRESH_COOKIE_NAME];
}
