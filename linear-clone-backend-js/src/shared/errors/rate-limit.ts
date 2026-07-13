import { BaseError } from './base-error';

export class RateLimitError extends BaseError {
  readonly statusCode = 429;
  readonly code = 'RATE_LIMITED';

  constructor(message = 'Rate limit exceeded. Try again later.') {
    super(message);
  }
}
