import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TimberTruckTrailerForm } from "@/components/forms/timber-truck-trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Timber Truck And Trailer Checklist | HSE",
  description: "Complete the timber truck and trailer inspection checklist.",
}

export default async function TimberTruckTrailerPage() {
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
      <TimberTruckTrailerForm brand={userData.brand} />
    </div>
  )
}