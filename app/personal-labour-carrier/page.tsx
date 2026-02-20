import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PersonalLabourCarrierForm } from "@/components/forms/personal-labour-carrier-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Personal / Labour Carrier Inspection Checklist | HSE",
  description: "Daily inspection checklist for personal and labour carriers.",
}

export default async function PersonalLabourCarrierPage() {
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
      <PersonalLabourCarrierForm brand={userData.brand} />
    </div>
  )
}