import { BaseError } from './base-error';

export class ForbiddenError extends BaseError {
  readonly statusCode = 403;
  readonly code = 'FORBIDDEN';

  constructor(message = 'Insufficient permissions') {
    super(message);
  }
}
