import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { AuditLogViewer } from '@/components/audit-log-viewer'

export default async function AuditLogsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userData?.role !== 'admin') redirect('/admin')

  return (
    <>
      <SiteHeader role="admin" />
      <AuditLogViewer />
    </>
  )
}
