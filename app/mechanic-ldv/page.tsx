import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MechanicLDVForm } from "@/components/forms/mechanic-ldv-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Mechanic LDV Daily Checklist | HSE",
  description: "Daily inspection checklist for mechanic LDV.",
}

export default async function MechanicLDVPage() {
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
      <MechanicLDVForm brand={userData.brand} />
    </div>
  )
}