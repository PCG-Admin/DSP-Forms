import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CintasignHarvestingForm } from '@/components/forms/cintasign-harvesting-form'
import { SiteHeader } from '@/components/site-header'

export const metadata = {
  title: "Cintasign Harvesting | Cintasign HSE",
  description: "Daily log for harvesting operations including fleet details and breakdowns.",
}

export default async function CintasignHarvestingPage() {
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
      <CintasignHarvestingForm brand={userData.brand} />
    </div>
  )
}