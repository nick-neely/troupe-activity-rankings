// lib/rateLimit.ts

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

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
      entry.count++;
      rateLimitMap.set(key, entry);
    } else {
      // Window expired, reset
      rateLimitMap.set(key, { count: 1, firstAttempt: now });
    }
  } else {
    rateLimitMap.set(key, { count: 1, firstAttempt: now });
  }
  return { limited: false };
}
