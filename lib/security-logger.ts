/**
 * Security event logger.
 * Emits structured JSON to stdout so Vercel captures it in function logs.
 * All entries are prefixed with [SECURITY] for easy log filtering.
 */

export type SecurityEventType =
  | 'AUTH_FAILURE'
  | 'UNAUTHORIZED_ACCESS'
  | 'RATE_LIMIT_HIT'
  | 'INVALID_INPUT'
  | 'USER_CREATED'
  | 'USER_DELETED'
  | 'SUSPICIOUS_ACTIVITY'

interface SecurityLogEntry {
  event: SecurityEventType
  ip?: string
  userId?: string
  path?: string
  details?: string
  timestamp: string
}

export function logSecurityEvent(
  entry: Omit<SecurityLogEntry, 'timestamp'>
): void {
  const log: SecurityLogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  }
  // console.warn so it appears in Vercel function logs at warning level
  console.warn('[SECURITY]', JSON.stringify(log))
}
