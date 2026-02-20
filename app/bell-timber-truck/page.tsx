import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BellTimberTruckForm } from "@/components/forms/bell-timber-truck-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Bell Timber Truck Pre-Shift Checklist | HSE",
  description: "Complete pre-shift inspection for Bell timber trucks.",
}

export default async function BellTimberTruckPage() {
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

  if (userError || !userData || !userData.brand) {
    redirect('/brand-select')
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <BellTimberTruckForm brand={userData.brand} />
    </div>
  )
}