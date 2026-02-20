import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WaterCartTrailerForm } from "@/components/forms/water-cart-trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Water Cart Trailer & Pressure Washer Checklist | HSE",
  description: "Complete the water cart trailer and pressure washer inspection checklist.",
}

export default async function WaterCartTrailerPage() {
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
      <WaterCartTrailerForm brand={userData.brand} />
    </div>
  )
}