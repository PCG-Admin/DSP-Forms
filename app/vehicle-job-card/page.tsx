import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VehicleJobCardForm } from "@/components/forms/vehicle-job-card-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Motorised Equipment/Vehicle Job Card | HSE",
  description: "Complete the vehicle job card.",
}

export default async function VehicleJobCardPage() {
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
      <VehicleJobCardForm brand={userData.brand} />
    </div>
  )
}