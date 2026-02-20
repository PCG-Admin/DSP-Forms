import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LightDeliveryForm } from "@/components/forms/light-delivery-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Light Delivery Vehicle Daily Checklist | HSE",
  description: "Daily inspection checklist for light delivery vehicles.",
}

export default async function LightDeliveryPage() {
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
      <LightDeliveryForm brand={userData.brand} />
    </div>
  )
}