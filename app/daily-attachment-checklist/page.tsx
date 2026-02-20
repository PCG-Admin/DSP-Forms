import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DailyAttachmentChecklistForm } from "@/components/forms/daily-attachment-checklist-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Daily Attachment Checklist | HSE",
  description: "Daily inspection checklist for harvester attachments.",
}

export default async function DailyAttachmentChecklistPage() {
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
      <DailyAttachmentChecklistForm brand={userData.brand} />
    </div>
  )
}