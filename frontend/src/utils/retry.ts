/**
 * Retry mechanism for failed API calls
 */
export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if we should retry this error
      if (!shouldRetry(lastError) || attempt === maxAttempts) {
        throw lastError;
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Wait before retrying with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError!;
}

/**
 * Default retry conditions
 */
export const defaultRetryConditions = {
  shouldRetry: (error: Error) => {
    // Retry on network errors
    if (error.message.includes('Network Error') || error.message.includes('fetch')) {
      return true;
    }

    // Retry on 5xx server errors
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      return true;
    }

    // Retry on timeout errors
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return true;
    }

    return false;
  },
};

/**
 * Retry with toast notifications
 */
export async function withRetryAndToast<T>(
  fn: () => Promise<T>,
  options: RetryOptions & {
    showToast?: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
    successMessage?: string;
    errorMessage?: string;
  } = {}
): Promise<T> {
  const {
    showToast,
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed after multiple attempts',
    ...retryOptions
  } = options;

  try {
    const result = await withRetry(fn, {
      ...retryOptions,
      onRetry: (attempt, error) => {
        if (showToast) {
          showToast('warning', `Retrying... Attempt ${attempt}/${retryOptions.maxAttempts || 3}`);
        }
        if (retryOptions.onRetry) {
          retryOptions.onRetry(attempt, error);
        }
      },
    });

    if (showToast && successMessage) {
      showToast('success', successMessage);
    }

    return result;
  } catch (error) {
    if (showToast && errorMessage) {
      showToast('error', errorMessage);
    }
    throw error;
  }
}
