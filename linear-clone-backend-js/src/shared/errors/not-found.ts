import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';

  constructor(message = 'Resource not found') {
    super(message);
  }
}
