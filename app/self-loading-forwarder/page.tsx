import { SelfLoadingForwarderForm } from "@/components/forms/self-loading-forwarder-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Self Loading Forwarder Pre-Shift Inspection Checklist | Ringomode HSE",
  description: "Complete your pre-shift inspection for the self-loading forwarder.",
}

export default function SelfLoadingForwarderPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <SelfLoadingForwarderForm />
    </div>
  )
}