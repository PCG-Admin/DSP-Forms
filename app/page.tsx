import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { UserHomePage } from '@/components/user-home-page'

export default async function HomePage() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('role, brand')
    .eq('id', user.id)
    .single()

  console.log('[HomePage] Fetched userData:', userData)

  if (dbError || !userData) {
    redirect('/brand-select')
  }

  if (userData.role === 'admin') {
    redirect('/admin')
  }

  if (!userData.brand) {
    redirect('/brand-select')
  }

  return (
    <>
      <SiteHeader role={userData.role} />
      {/* ✅ Pass the brand to UserHomePage */}
      <UserHomePage brand={userData.brand} />
    </>
  )
}