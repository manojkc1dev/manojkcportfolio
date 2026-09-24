export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  _hp?: string;
  hp_field?: string;
}

export interface SanitizedContactData {
  name: string;
  email: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: SanitizedContactData;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}
