import type { Metadata } from "next"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SiteHeader } from "@/components/site-header"
import { LowbedTrailerForm } from "@/components/forms/lowbed-trailer-form"

export const metadata: Metadata = {
  title: "Lowbed & Roll Back Trailer Pre-Shift Inspection | HSE",
  description: "Complete the lowbed and roll back trailer pre-shift use inspection checklist.",
}

export default async function LowbedTrailerPage() {
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
      <LowbedTrailerForm brand={userData.brand} />
    </div>
  )
}