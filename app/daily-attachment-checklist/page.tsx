import { DailyAttachmentChecklistForm } from "@/components/forms/daily-attachment-checklist-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Daily Attachment Checklist | Ringomode HSE",
  description: "Daily inspection checklist for harvester attachments (head, grab, winch).",
}

export default function DailyAttachmentChecklistPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <DailyAttachmentChecklistForm />
    </div>
  )
}