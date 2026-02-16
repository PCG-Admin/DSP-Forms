import { TrailerForm } from "@/components/forms/trailer-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Trailer (Excluding Labour) Inspection Checklist | Ringomode HSE",
  description: "Complete your trailer inspection checklist.",
}

export default function TrailerPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <TrailerForm />
    </div>
  )
}