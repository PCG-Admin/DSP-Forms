import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LowbedStepdeckTrailerForm } from "@/components/forms/lowbed-stepdeck-trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Lowbed & Step Deck Trailer Pre-Use Inspection | Ringomode HSE",
  description: "Pre-use inspection checklist for lowbed and step deck trailers.",
}

export default async function LowbedStepdeckTrailerPage() {
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
      <LowbedStepdeckTrailerForm brand={userData.brand} />
    </div>
  )
}