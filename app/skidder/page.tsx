import { SkidderForm } from "@/components/forms/skidder-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Skidder (Grapple & Cable) Pre-Shift Inspection Checklist | Ringomode HSE",
  description: "Complete your pre-shift inspection for the skidder (grapple & cable).",
}

export default function SkidderPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <SkidderForm />
    </div>
  )
}