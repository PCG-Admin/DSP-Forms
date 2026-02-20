import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ExcavatorLoaderForm } from "@/components/forms/excavator-loader-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Excavator Loader Pre-Shift Inspection | HSE",
  description: "Complete your pre-shift excavator loader inspection checklist.",
}

export default async function ExcavatorLoaderPage() {
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
      <ExcavatorLoaderForm brand={userData.brand} />
    </div>
  )
}