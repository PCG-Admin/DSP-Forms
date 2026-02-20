import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DezziTimberTruckForm } from "@/components/forms/dezzi-timber-truck-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Dezzi Timber Truck Pre-Shift Checklist | HSE",
  description: "Complete pre-shift inspection for Dezzi timber trucks.",
}

export default async function DezziTimberTruckPage() {
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
      <DezziTimberTruckForm brand={userData.brand} />
    </div>
  )
}