import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DieselCartTrailerForm } from "@/components/forms/diesel-cart-trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Diesel Cart Trailer Inspection Checklist | HSE",
  description: "Inspection checklist for diesel cart trailers.",
}

export default async function DieselCartTrailerPage() {
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
      <DieselCartTrailerForm brand={userData.brand} />
    </div>
  )
}