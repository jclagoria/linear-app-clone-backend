import { BaseError } from './base-error';
import { ErrorDetail } from './types';

export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';

  constructor(message = 'Invalid input provided', details?: ErrorDetail[]) {
    super(message, details);
  }
}
