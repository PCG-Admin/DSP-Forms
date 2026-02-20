import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WeeklyMachineryConditionForm } from "@/components/forms/weekly-machinery-condition-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Weekly Machinery Condition Assessment | HSE",
  description: "Complete the weekly machinery condition assessment.",
}

export default async function WeeklyMachineryConditionPage() {
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
      <WeeklyMachineryConditionForm brand={userData.brand} />
    </div>
  )
}