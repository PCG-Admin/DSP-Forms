import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export type AuditAction =
  | 'CREATE_USER'
  | 'DELETE_USER'
  | 'CHANGE_PASSWORD'
  | 'CHANGE_ROLE'
  | 'CHANGE_BRAND'
  | 'SUBMIT_FORM'
  | 'DELETE_SUBMISSION'

interface AuditEntry {
  adminId?: string
  adminEmail?: string
  action: AuditAction
  targetId?: string
  targetEmail?: string
  details?: Record<string, unknown>
}

function adminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function logAuditEvent(entry: AuditEntry): Promise<void> {
  try {
    const client = adminClient()
    await client.from('audit_logs').insert({
      admin_id: entry.adminId ?? null,
      admin_email: entry.adminEmail ?? null,
      action: entry.action,
      target_id: entry.targetId ?? null,
      target_email: entry.targetEmail ?? null,
      details: entry.details ?? null,
    })
  } catch (err) {
    console.error('[AuditLog] Failed to write audit log:', err)
  }
}
