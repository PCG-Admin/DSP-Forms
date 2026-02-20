import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CintasignShorthaulForm } from '@/components/forms/cintasign-shorthaul-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
  title: "Cintasign Shorthaul | Cintasign HSE",
  description: "Daily log for shorthaul operations including fleet details and breakdowns.",
}

export default async function CintasignShorthaulPage() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('brand')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.brand) redirect('/brand-select')

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <CintasignShorthaulForm brand={userData.brand} />
    </div>
  )
}