import { BaseError } from './base-error';

export class ConflictError extends BaseError {
  readonly statusCode = 409;
  readonly code = 'CONFLICT';

  constructor(message = 'Resource already exists') {
    super(message);
  }
}
