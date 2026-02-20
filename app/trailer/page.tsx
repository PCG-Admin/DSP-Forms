import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TrailerForm } from "@/components/forms/trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Trailer (Excluding Labour) Inspection Checklist | HSE",
  description: "Complete the trailer inspection checklist.",
}

export default async function TrailerPage() {
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
      <TrailerForm brand={userData.brand} />
    </div>
  )
}