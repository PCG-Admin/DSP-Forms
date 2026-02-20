import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ServiceDieselTruckForm } from "@/components/forms/service-diesel-truck-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Service/Diesel Truck Pre-Shift Inspection | HSE",
  description: "Complete the service/diesel truck pre-shift inspection checklist.",
}

export default async function ServiceDieselTruckPage() {
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
      <ServiceDieselTruckForm brand={userData.brand} />
    </div>
  )
}