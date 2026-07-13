import { ErrorDetail } from './types';

export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  readonly details?: ErrorDetail[];

  constructor(message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && this.details.length > 0 && { details: this.details }),
      },
    };
  }
}
