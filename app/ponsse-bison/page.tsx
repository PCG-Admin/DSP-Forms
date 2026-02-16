import { PonsseBisonForm } from "@/components/forms/ponsse-bison-form"
import { SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Ponsse Bison Pre-Shift Inspection Checklist | Ringomode HSE",
  description: "Complete your pre-shift inspection for the Ponsse Bison harvester.",
}

export default function PonsseBisonPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader role="user" />
      <PonsseBisonForm />
    </div>
  )
}