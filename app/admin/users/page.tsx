import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { UserManagement } from '@/components/user-management'

export const metadata = {
  title: 'Manage Users',
  description: 'Create and manage user accounts.',
}

export default async function UsersPage() {
  const supabase = createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="admin" />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <UserManagement />
      </main>
    </div>
  )
}
