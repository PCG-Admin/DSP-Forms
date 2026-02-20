import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SelfLoadingForwarderForm } from "@/components/forms/self-loading-forwarder-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Self Loading Forwarder Pre-Shift Inspection | HSE",
  description: "Complete the self loading forwarder pre-shift inspection checklist.",
}

export default async function SelfLoadingForwarderPage() {
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
      <SelfLoadingForwarderForm brand={userData.brand} />
    </div>
  )
}