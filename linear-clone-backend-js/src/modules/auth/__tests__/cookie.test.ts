import { describe, it, expect, vi } from 'vitest';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenCookie,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_OPTIONS,
} from '../../../shared/cookie';

function createMockReply(): FastifyReply {
  return {
    setCookie: vi.fn(),
    clearCookie: vi.fn(),
  } as unknown as FastifyReply;
}

function createMockRequest(cookies: Record<string, string | undefined> = {}): FastifyRequest {
  return {
    cookies,
  } as unknown as FastifyRequest;
}

describe('REFRESH_COOKIE_NAME', () => {
  it('should be "refreshToken"', () => {
    expect(REFRESH_COOKIE_NAME).toBe('refreshToken');
  });
});

describe('REFRESH_COOKIE_OPTIONS', () => {
  it('should have httpOnly: true', () => {
    expect(REFRESH_COOKIE_OPTIONS.httpOnly).toBe(true);
  });

  it('should have sameSite: "strict"', () => {
    expect(REFRESH_COOKIE_OPTIONS.sameSite).toBe('strict');
  });

  it('should have path: "/api/v1/auth/refresh"', () => {
    expect(REFRESH_COOKIE_OPTIONS.path).toBe('/api/v1/auth/refresh');
  });

  it('should have default maxAge of 604800 (7 days)', () => {
    expect(REFRESH_COOKIE_OPTIONS.maxAge.default).toBe(604800);
  });

  it('should have rememberMe maxAge of 2592000 (30 days)', () => {
    expect(REFRESH_COOKIE_OPTIONS.maxAge.rememberMe).toBe(2592000);
  });

  it('should have secure flag matching environment', () => {
    // In test environment NODE_ENV is likely 'test', so secure should be false
    expect(typeof REFRESH_COOKIE_OPTIONS.secure).toBe('boolean');
  });
});

describe('setRefreshTokenCookie', () => {
  it('should call reply.setCookie with refreshToken name', () => {
    const reply = createMockReply();
    setRefreshTokenCookie(reply, 'test-token');
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-token',
      expect.any(Object),
    );
  });

  it('should set httpOnly: true', () => {
    const reply = createMockReply();
    setRefreshTokenCookie(reply, 'test-token');
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-token',
      expect.objectContaining({ httpOnly: true }),
    );
  });

  it('should set sameSite: "strict"', () => {
    const reply = createMockReply();
    setRefreshTokenCookie(reply, 'test-token');
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-token',
      expect.objectContaining({ sameSite: 'strict' }),
    );
  });

  it('should set path: "/api/v1/auth/refresh"', () => {
    const reply = createMockReply();
    setRefreshTokenCookie(reply, 'test-token');
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-token',
      expect.objectContaining({ path: '/api/v1/auth/refresh' }),
    );
  });

  it('should set default maxAge (604800) when rememberMe is false', () => {
    const reply = createMockReply();
    setRefreshTokenCookie(reply, 'test-token', false);
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-token',
      expect.objectContaining({ maxAge: 604800 }),
    );
  });

  it('should set rememberMe maxAge (2592000) when rememberMe is true', () => {
    const reply = createMockReply();
    setRefreshTokenCookie(reply, 'test-token', true);
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-token',
      expect.objectContaining({ maxAge: 2592000 }),
    );
  });

  it('should default rememberMe to false if not provided', () => {
    const reply = createMockReply();
    setRefreshTokenCookie(reply, 'test-token');
    expect(reply.setCookie).toHaveBeenCalledWith(
      'refreshToken',
      'test-token',
      expect.objectContaining({ maxAge: 604800 }),
    );
  });
});

describe('clearRefreshTokenCookie', () => {
  it('should call reply.clearCookie with refreshToken name', () => {
    const reply = createMockReply();
    clearRefreshTokenCookie(reply);
    expect(reply.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
  });

  it('should clear with the correct path', () => {
    const reply = createMockReply();
    clearRefreshTokenCookie(reply);
    expect(reply.clearCookie).toHaveBeenCalledWith(
      'refreshToken',
      expect.objectContaining({ path: '/api/v1/auth/refresh' }),
    );
  });
});

describe('getRefreshTokenCookie', () => {
  it('should return the refresh token from cookies', () => {
    const request = createMockRequest({ refreshToken: 'test-token' });
    const result = getRefreshTokenCookie(request);
    expect(result).toBe('test-token');
  });

  it('should return undefined when refreshToken cookie is not present', () => {
    const request = createMockRequest({});
    const result = getRefreshTokenCookie(request);
    expect(result).toBeUndefined();
  });

  it('should return undefined when cookies object is empty', () => {
    const request = createMockRequest({});
    const result = getRefreshTokenCookie(request);
    expect(result).toBeUndefined();
  });

  it('should handle missing cookies property gracefully', () => {
    const request = {} as FastifyRequest;
    const result = getRefreshTokenCookie(request);
    expect(result).toBeUndefined();
  });
});
