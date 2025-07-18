// lib/rateLimit.ts

import { RateLimiterMemory } from "rate-limiter-flexible";

// Default config: 5 attempts per 10 minutes
const DEFAULT_POINTS = 5;
const DEFAULT_DURATION = 10 * 60; // seconds

const rateLimiter = new RateLimiterMemory({
  points: DEFAULT_POINTS,
  duration: DEFAULT_DURATION,
});

/**
 * Checks if a key is currently rate limited based on attempt count within a time window.
 *
 * @param key - Unique identifier for the rate limit (e.g., user ID, IP address)
 * @param maxAttempts - Maximum number of attempts allowed within the window (default: 5)
 * @param windowMs - Time window in milliseconds (default: 10 minutes)
 * @returns Object with limited status and optional error message
 *
 * @example
 * ```ts
 * const { limited, error } = checkRateLimit({ key: 'user:123' });
 * ```
 */
export async function checkRateLimit(params: {
  key: string;
  maxAttempts?: number;
  windowSeconds?: number;
}): Promise<{ limited: boolean; error?: string }> {
  const {
    key,
    maxAttempts = DEFAULT_POINTS,
    windowSeconds = DEFAULT_DURATION,
  } = params;

  // Use custom limits if provided, otherwise use default limiter
  const limiter =
    maxAttempts !== DEFAULT_POINTS || windowSeconds !== DEFAULT_DURATION
      ? new RateLimiterMemory({ points: maxAttempts, duration: windowSeconds })
      : rateLimiter;

  try {
    await limiter.consume(key, 1);
    return { limited: false };
  } catch {
    return {
      limited: true,
      error: `Too many attempts. Please try again later.`,
    };
  }
}
