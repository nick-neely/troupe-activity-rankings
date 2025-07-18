// lib/rateLimit.ts

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 10 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

/**
 * Cleans up expired entries from the `rateLimitMap`.
 *
 * Iterates through all entries in the map and removes those whose
 * time window has expired, determined by comparing the current time
 * with the `firstAttempt` timestamp and the `CLEANUP_INTERVAL_MS` threshold.
 */
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    // Remove if window expired
    if (now - entry.firstAttempt > CLEANUP_INTERVAL_MS) {
      rateLimitMap.delete(key);
    }
  }
}
setInterval(cleanupRateLimitMap, CLEANUP_INTERVAL_MS);

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
 * if (limited) {
 *   return res.status(429).json({ error });
 * }
 * ```
 */
export function checkRateLimit({
  key,
  maxAttempts = 5,
  windowMs = 10 * 60 * 1000,
}: {
  key: string;
  maxAttempts?: number;
  windowMs?: number;
}): { limited: boolean; error?: string } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (entry) {
    if (now - entry.firstAttempt < windowMs) {
      if (entry.count >= maxAttempts) {
        return {
          limited: true,
          error: `Too many attempts. Please try again later.`,
        };
      }
      rateLimitMap.set(key, { ...entry, count: entry.count + 1 });
    } else {
      // Window expired, reset
      rateLimitMap.set(key, { count: 1, firstAttempt: now });
    }
  } else {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
  }
  return { limited: false };
}
