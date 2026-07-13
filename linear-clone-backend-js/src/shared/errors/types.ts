export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
