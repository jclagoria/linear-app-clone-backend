/**
 * Rate limiter for WebSocket connections.
 * Tracks subscribe/unsubscribe operations per connection.
 */
export class ConnectionRateLimiter {
  private readonly limits = new Map<string, { count: number; resetAt: number }>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 100, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if a connection has exceeded the rate limit.
   * @param connectionId - The connection ID to check
   * @returns true if the request is allowed, false if rate limited
   */
  isAllowed(connectionId: string): boolean {
    const now = Date.now();
    const record = this.limits.get(connectionId);

    if (!record || now > record.resetAt) {
      // New window or expired window
      this.limits.set(connectionId, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxRequests) {
      // Rate limit exceeded
      return false;
    }

    // Increment count
    record.count++;
    return true;
  }

  /**
   * Reset rate limit for a connection (e.g., on disconnect).
   * @param connectionId - The connection ID to reset
   */
  reset(connectionId: string): void {
    this.limits.delete(connectionId);
  }

  /**
   * Get remaining requests for a connection.
   * @param connectionId - The connection ID to check
   * @returns Number of remaining requests in current window
   */
  getRemaining(connectionId: string): number {
    const now = Date.now();
    const record = this.limits.get(connectionId);

    if (!record || now > record.resetAt) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - record.count);
  }
}
