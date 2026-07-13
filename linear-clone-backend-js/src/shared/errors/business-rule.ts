import { BaseError } from './base-error';

export class BusinessRuleError extends BaseError {
  readonly statusCode = 422;
  readonly code = 'BUSINESS_RULE_ERROR';

  constructor(message = 'Domain rule violation') {
    super(message);
  }
}
