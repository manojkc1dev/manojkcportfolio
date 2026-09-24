import type { ValidationResult } from './types.js';

// RFC 5322-compliant practical email validation regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Pattern to detect HTML tags in name
const HTML_TAG_REGEX = /<[^>]*>/g;

/**
 * Validates and sanitizes contact form submissions.
 * Rules:
 * - name: 2-80 chars, no HTML
 * - email: RFC-compliant regex, ≤254 chars
 * - message: 10-2000 chars, HTML tags stripped
 */
export function validateContactInput(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      error: 'Invalid JSON request payload.',
    };
  }

  const { name, email, message } = payload as Record<string, unknown>;

  // 1. Validate name
  if (typeof name !== 'string') {
    return { valid: false, error: 'Name is required and must be text.' };
  }
  const trimmedName = name.trim();
  if (HTML_TAG_REGEX.test(trimmedName)) {
    return { valid: false, error: 'Name must not contain HTML tags.' };
  }
  if (trimmedName.length < 2 || trimmedName.length > 80) {
    return { valid: false, error: 'Name must be between 2 and 80 characters.' };
  }

  // 2. Validate email
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email is required and must be text.' };
  }
  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0 || trimmedEmail.length > 254) {
    return { valid: false, error: 'Email must be between 1 and 254 characters.' };
  }
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, error: 'Please provide a valid email address.' };
  }

  // 3. Validate message
  if (typeof message !== 'string') {
    return { valid: false, error: 'Message is required and must be text.' };
  }
  // Strip HTML tags from message
  const sanitizedMessage = message.replace(HTML_TAG_REGEX, '').trim();
  if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
    return { valid: false, error: 'Message must be between 10 and 2000 characters.' };
  }

  return {
    valid: true,
    data: {
      name: trimmedName,
      email: trimmedEmail,
      message: sanitizedMessage,
    },
  };
}
