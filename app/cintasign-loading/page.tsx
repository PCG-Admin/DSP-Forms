import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CintasignLoadingForm } from '@/components/forms/cintasign-loading-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
  title: "Cintasign Loading | Cintasign HSE",
  description: "Daily log for loading operations including delivery notes and driver details.",
}

export default async function CintasignLoadingPage() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('brand')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.brand) {
    redirect('/brand-select')
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <CintasignLoadingForm brand={userData.brand} />
    </div>
  )
}