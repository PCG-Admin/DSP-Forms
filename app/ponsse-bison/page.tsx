import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PonsseBisonForm } from "@/components/forms/ponsse-bison-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Ponsse Bison Pre-Shift Inspection | HSE",
  description: "Complete the Ponsse Bison pre-shift inspection checklist.",
}

export default async function PonsseBisonPage() {
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
      <PonsseBisonForm brand={userData.brand} />
    </div>
  )
}