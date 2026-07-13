import { BaseError } from './base-error';

export class InternalError extends BaseError {
  readonly statusCode = 500;
  readonly code = 'SERVER_ERROR';

  constructor(message = 'Internal server error') {
    super(message);
  }
}
