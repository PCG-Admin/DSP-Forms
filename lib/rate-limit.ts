/**
 * In-memory sliding-window rate limiter.
 * Provides per-instance protection on Vercel serverless functions.
 * For multi-instance enforcement, upgrade to @vercel/kv (Redis).
 */

const store = new Map<string, number[]>()

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInMs: number
}

interface RateLimitOptions {
  /** Time window in milliseconds */
  windowMs: number
  /** Maximum requests allowed within the window */
  max: number
}

/**
 * Check whether a key (IP, user ID, etc.) has exceeded the rate limit.
 * Returns allowed=false if the limit has been reached.
 */
export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const windowStart = now - options.windowMs

  // Get existing timestamps for this key, keep only those within the window
  const timestamps = (store.get(key) ?? []).filter(t => t > windowStart)

  if (timestamps.length >= options.max) {
    store.set(key, timestamps)
    const oldestInWindow = Math.min(...timestamps)
    return {
      allowed: false,
      remaining: 0,
      resetInMs: oldestInWindow + options.windowMs - now,
    }
  }

  timestamps.push(now)
  store.set(key, timestamps)

  // Periodically prune stale entries to prevent memory growth
  if (store.size > 5000) {
    for (const [k, ts] of store.entries()) {
      if (ts.every(t => t <= windowStart)) store.delete(k)
    }
  }

  return {
    allowed: true,
    remaining: options.max - timestamps.length,
    resetInMs: options.windowMs,
  }
}

/** Preset: strict limit for sensitive write operations (e.g. user creation, login) */
export const STRICT_LIMIT: RateLimitOptions = { windowMs: 60_000, max: 10 }

/** Preset: standard limit for regular API calls */
export const STANDARD_LIMIT: RateLimitOptions = { windowMs: 60_000, max: 30 }

/** Extract the best available client IP from a Request */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
