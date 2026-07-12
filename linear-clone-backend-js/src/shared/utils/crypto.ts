import { createHash } from 'crypto';

/**
 * Hash a token using SHA-256 for deterministic lookups.
 * Use this for refresh tokens where we need to lookup by hash.
 * SHA-256 is appropriate here because:
 * - Refresh tokens are high-entropy JWTs (not user-chosen passwords)
 * - The JWT signature already provides cryptographic security
 * - Deterministic hashing allows exact-match database lookups
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a token against a stored SHA-256 hash.
 */
export function verifyTokenHash(token: string, storedHash: string): boolean {
  return hashToken(token) === storedHash;
}
